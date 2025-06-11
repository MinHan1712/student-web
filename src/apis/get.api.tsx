import { IResponseN } from "../interfaces/common";
import { IClassCourseDTO, IClassDTO, IClassRegistrationsDTO, IConductScoreDTO, ICourseDTO, ICourseFacultyDTO, IFacultyDTO, IGradeDTO, IMasterDataDTO, IStatisticDetailDTO, IStatisticDTO, IStudentDTO, ITeacherDTO } from "../interfaces/course";
import privateClient from "./clients/private.client";

const endpoint = {
  courses: 'courses',
  teachers: 'teachers',
  students: 'students',
  classes: 'classes',
  faculties: 'faculties',
  courseFaculties: 'course-faculties',
  classRegistrations: 'class-registrations',
  grades: "grades",
  conductScores: "conduct/get",
  static: "statistics",
  statisticsDetails: "statistics-details",
  masterData: "master-data"
};

const getApi = {
  getCourses: async (params: any): Promise<IResponseN<ICourseDTO[]>> => {
    try {
      const response = await privateClient.get<ICourseDTO[]>(
        endpoint.courses + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<ICourseDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getTeachers: async (params: any): Promise<IResponseN<ITeacherDTO[]>> => {
    try {
      const response = await privateClient.get<ITeacherDTO[]>(
        endpoint.teachers + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<ITeacherDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getStudents: async (params: any): Promise<IResponseN<IStudentDTO[]>> => {
    try {
      const response = await privateClient.get<IStudentDTO[]>(
        endpoint.students + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IStudentDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getClasses: async (params: any): Promise<IResponseN<IClassDTO[]>> => {
    try {
      const response = await privateClient.get<IClassDTO[]>(
        endpoint.classes + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IClassDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getFaculties: async (params: any): Promise<IResponseN<IFacultyDTO[]>> => {
    try {
      const response = await privateClient.get<IFacultyDTO[]>(
        endpoint.faculties + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IFacultyDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getCourseFaculties: async (params: any): Promise<IResponseN<ICourseFacultyDTO[]>> => {
    try {
      const response = await privateClient.get<ICourseFacultyDTO[]>(
        endpoint.courseFaculties + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<ICourseFacultyDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getClassRegistrations: async (params: any): Promise<IResponseN<IClassRegistrationsDTO[]>> => {
    try {
      const response = await privateClient.get<IClassRegistrationsDTO[]>(
        endpoint.classRegistrations + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IClassRegistrationsDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getGrades: async (params: any): Promise<IResponseN<IGradeDTO[]>> => {
    try {
      const response = await privateClient.get<IGradeDTO[]>(
        endpoint.grades + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IGradeDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getConductScores: async (params: any): Promise<IResponseN<IConductScoreDTO[]>> => {
    try {
      const response = await privateClient.get<IConductScoreDTO[]>(
        endpoint.conductScores + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IConductScoreDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getStatic: async (params: any): Promise<IResponseN<IStatisticDTO[]>> => {
    try {
      const response = await privateClient.get<IStatisticDTO[]>(
        endpoint.static + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IStatisticDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getStatisticsDetail: async (params: any): Promise<IResponseN<IStatisticDetailDTO[]>> => {
    try {
      const response = await privateClient.get<IStatisticDetailDTO[]>(
        endpoint.statisticsDetails + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IStatisticDetailDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  },
  getMasterData: async (params: any): Promise<IResponseN<IMasterDataDTO[]>> => {
    try {
      const response = await privateClient.get<IMasterDataDTO[]>(
        endpoint.masterData + params,
      );

      const total = Number(response.headers['x-total-count']);

      const respon: IResponseN<IMasterDataDTO[]> = {
        total: total,
        data: response.data,
      };

      return respon;
    } catch (error) {
      throw error;
    }
  }
};


export default getApi;