/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import config from "../../config";
import AppError from "../../errors/AppError";
import AcademicDepartmentModel from "../academicDepartment/academicDepartment.model";
import AcademicSemesterModel from "../academicSemester/academicSemester.model";
import { TCreateAdmin } from "../admin/admin.interface";
import AdminModel from "../admin/admin.model";
import { TCreateFaculty } from "../faculty/faculty.interface";
import FacultyModel from "../faculty/faculty.model";
import { TCreateStudent } from "../students/student.interface";
import { Student } from "../students/student.model";
import { TUser } from "./user.interface";
import UserModel from "./user.model";
import { generateAdminId, generateFacultyId, generatedStudentId } from "./user.utils";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createStudentIntoDB = async (file: any, password: string, payload: TCreateStudent) => {
  // CREATED A EMPTY OBJECT FOR STORE USER DATA
  const userData: Partial<TUser> = {};

  // IF PASSWORD IS NOT GIVEN, USE DEFAULT PASSWORD
  userData.password = password || (config.default_password as string);

  // SET A ROLE FOR USER
  userData.role = "student";
  // SET EMAIL
  userData.email = payload.email;

  // FIND ADMISSION SEMESTER FOR GENERATING STUDENT ID
  const academicSemester = await AcademicSemesterModel.findById(payload.admissionSemester);
  const academicDepartment = await AcademicDepartmentModel.findById(payload.academicDepartment);

  if (!academicSemester) {
    throw new AppError(400, "Invalid academic Semester");
  } else if (!academicDepartment) {
    throw new AppError(400, "Invalid Academic Department");
  }
  payload.academicFaculty = academicDepartment.academicFaculty;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generatedStudentId(academicSemester);

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file.path;
      // SET IMAGE TO CLOUDINARY
      const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
        secure_url: string;
      };
      payload.profileImage = secure_url;
    }

    // create a user (session-one)
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    // set id, and _id as a user
    payload.id = newUser[0].id;
    payload.userId = newUser[0]._id; // reference _id

    // create a student (session two)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, error?.message || "Failed to create user");
  }
};

const createFacultyIntoDb = async (file: any, password: string, payload: TCreateFaculty) => {
  const userData: Partial<TUser> = {};

  userData.password = password || config.default_password;
  userData.role = "faculty";
  // SET EMAIL
  userData.email = payload.email;

  const academicDepartment = await AcademicDepartmentModel.findById(payload.academicDepartment);

  if (!academicDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, "Academic Department not Found");
  }

  userData.id = await generateFacultyId();
  if (file) {
    const imageName = `${userData.id}${payload?.name?.firstName}`;
    const path = file.path;
    // SET IMAGE TO CLOUDINARY
    const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
      secure_url: string;
    };
    payload.profileImage = secure_url;
  }
  payload.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create faculty");
    }

    payload.id = newUser[0].id;
    payload.userId = newUser[0]._id;

    const newFaculty = await FacultyModel.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create Faculty");
    }
    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error?.message || "Failed to create faculty");
  }
};

const createAdminIntoDb = async (file: any, password: string, payload: TCreateAdmin) => {
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_password as string);

  // SET ROLE
  userData.role = "admin";
  // SET EMAIL
  userData.email = payload.email;
  userData.id = await generateAdminId();
  if (file) {
    const imageName = `${userData.id}${payload?.name?.firstName}`;
    const path = file.path;
    // SET IMAGE TO CLOUDINARY
    const { secure_url } = (await sendImageToCloudinary(imageName, path)) as {
      secure_url: string;
    };
    payload.profileImage = secure_url;
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const newUser = await UserModel.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }
    payload.userId = newUser[0]._id;
    payload.id = newUser[0].id;

    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, error.message || "Failed to create Admin");
  }
};

const getMe = async (id: string, role: string) => {
  //const { id, role } = verifyToken(token, config.jwt_access_secret as string);

  let result = null;

  if (role === "admin") {
    result = await AdminModel.findOne({ id }).populate("userId");
  }
  if (role === "faculty") {
    result = await FacultyModel.findOne({ id }).populate("userId");
  }
  if (role === "student") {
    result = await Student.findOne({ id }).populate("userId");
  }
  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(
    id,
    { status: payload.status },
    { new: true, runValidators: true },
  );

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDb,
  createAdminIntoDb,
  getMe,
  changeStatus,
};
