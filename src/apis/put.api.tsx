import { IClassCourseDTO, IClassDTO, ICourseDTO, IFacultyDTO, IStatisticDTO, IStudentDTO, ITeacherDTO, SemesterSummaryResponse } from "../interfaces/course";
import privateClient from "./clients/private.client";

const endpoint = {
  faculty: (id: any) => `faculties/${id}`,
  classes: (id: any) => `classes/${id}`,
  courses: (id: any) => `courses/${id}`,
  teachers: (id: any) => `teachers/${id}`,
  statistics: (id: any) => `statistics/${id}`,
  students: (id: any) => `students/${id}`,
};

const putApi = {
  putFaculty: async (id: any, param: any): Promise<IFacultyDTO> => {
    try {
      const response = await privateClient.patch<IFacultyDTO>(
        endpoint.faculty(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putClasses: async (id: any, param: any): Promise<IClassDTO> => {
    try {
      const response = await privateClient.patch<IClassDTO>(
        endpoint.classes(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putCourses: async (id: any, param: any): Promise<ICourseDTO> => {
    try {
      const response = await privateClient.patch<ICourseDTO>(
        endpoint.courses(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putTeaches: async (id: any, param: any): Promise<ITeacherDTO> => {
    try {
      const response = await privateClient.patch<ITeacherDTO>(
        endpoint.teachers(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putStatistic: async (id: any, param: any): Promise<IStatisticDTO> => {
    try {
      const response = await privateClient.patch<IStatisticDTO>(
        endpoint.statistics(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  putStudent: async (id: any, param: any): Promise<IStudentDTO> => {
    try {
      const response = await privateClient.patch<IStudentDTO>(
        endpoint.students(id), param
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};


export default putApi;