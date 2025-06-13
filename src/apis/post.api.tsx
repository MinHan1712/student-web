import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassRegistrationsDTO, IConductScoreDTO, ICourseDTO, ICourseFacultyDTO, IFacultyDTO, IGradeDTO, IStudentDTO, ITeacherDTO } from "../interfaces/course";
import privateClient from "./clients/private.client";

const endpoint = {
  courses: 'courses',
  teachers: 'teachers',
  students: 'students',
  classes: 'classes',
  faculties: 'faculties',
  courseFaculties: 'course-faculties',
  classRegistrations: 'class-registrations',
  grades: "grades/multi",
  conduct: "conduct-scores/multi",
  updateClass: (id: number) => `classes/update/${id}`,
  deleteClass: (id: number) => `/classes/delete/${id}`,
  scorseConde: 'conduct/create',
  report: '/statistic/create'
};

const postApi = {
  createCoursesA: async (params: any): Promise<ICourseDTO> => {
    try {
      const response = await privateClient.post<ICourseDTO>(
        endpoint.scorseConde + params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createCourses: async (params: any): Promise<ICourseDTO> => {
    try {
      const response = await privateClient.post<ICourseDTO>(
        endpoint.courses, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createTeachers: async (params: any): Promise<ITeacherDTO> => {
    try {
      const response = await privateClient.post<ITeacherDTO>(
        endpoint.teachers, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createStudents: async (params: any): Promise<IStudentDTO> => {
    try {
      const response = await privateClient.post<IStudentDTO>(
        endpoint.students, params
      );



      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createClasses: async (params: any): Promise<IClassDTO> => {
    try {
      const response = await privateClient.post<IClassDTO>(
        endpoint.classes,
        params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createFaculties: async (params: any): Promise<IFacultyDTO> => {
    try {
      const response = await privateClient.post<IFacultyDTO>(
        endpoint.faculties, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createCourseFaculties: async (params: any): Promise<ICourseFacultyDTO> => {
    try {
      const response = await privateClient.post<ICourseFacultyDTO>(
        endpoint.courseFaculties, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createClassRegistrations: async (params: any): Promise<IClassRegistrationsDTO> => {
    try {
      const response = await privateClient.post<IClassRegistrationsDTO>(
        endpoint.classRegistrations, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createGrades: async (params: any): Promise<IGradeDTO[]> => {
    try {
      const response = await privateClient.post<IGradeDTO[]>(
        endpoint.grades, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createConduct: async (params: any): Promise<IConductScoreDTO[]> => {
    try {
      const response = await privateClient.post<IConductScoreDTO[]>(
        endpoint.conduct, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateClass: async (id: number, params: any): Promise<Object> => {
    try {
      const response = await privateClient.post<Object>(
        endpoint.updateClass(id), params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createReport: async (params: any): Promise<Object> => {
    try {
      const response = await privateClient.post<Object>(
        endpoint.report, params
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  deleteClass: async (id: number): Promise<Object> => {
    try {
      const response = await privateClient.post<Object>(
        endpoint.deleteClass(id)
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default postApi;