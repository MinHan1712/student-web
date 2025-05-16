import { IClassDTO, ICourseDTO, IFacultyDTO, ITeacherDTO } from "../interfaces/course";
import privateClient from "./clients/private.client";

const endpoint = {
  faculty: (id: any) => `faculties/${id}`,
  classes: (id: any) => `classes/${id}`,
  courses: (id: any) => `courses/${id}`,
  teachers: (id: any) => `teachers/${id}`,
};

const getDetailsApi = {
  getFaculty: async (id: any): Promise<IFacultyDTO> => {
    try {
      const response = await privateClient.get<IFacultyDTO>(
       endpoint.faculty(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getClasses: async (id: any): Promise<IClassDTO> => {
    try {
      const response = await privateClient.get<IClassDTO>(
       endpoint.classes(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCourses: async (id: any): Promise<ICourseDTO> => {
    try {
      const response = await privateClient.get<ICourseDTO>(
       endpoint.classes(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getTeaches: async (id: any): Promise<ITeacherDTO> => {
    try {
      const response = await privateClient.get<ITeacherDTO>(
       endpoint.teachers(id)
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default getDetailsApi;