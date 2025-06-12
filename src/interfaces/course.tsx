import { Auditing, IPagingAndSortRequest } from "./common";

export interface ICourseDTO extends Auditing {
  id: number;
  courseCode?: string;
  courseTitle?: string;
  credits?: string;
  lecture?: string;
  tutorialDiscussion?: string;
  practical?: string;
  laboratory?: string;
  selfStudy?: string;
  numberOfSessions?: string;
  courseType?: string;
  notes?: string;
  status?: boolean;
  semester?: string;
}


export interface ICourseFilter extends IPagingAndSortRequest {
  "courseCode.contains"?: string;
  "courseTitle.contains"?: string;
  "status.equals"?: boolean;
  "semester.contains"?: string;
}

export interface ICourseFacultyDTO extends Auditing {
  id: string;
  course: ICourseDTO,
  faculties: IFacultyDTO
}

export interface ICourseFacultyFilter extends IPagingAndSortRequest {
  "facultiesId.equals"?: string;
}
//--------------------------teaches---------------------//
export interface ITeacherDTO extends Auditing {
  id: number;
  teachersCode?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  startDate?: string;
  endDate?: string;
  position?: string;
  qualification?: string;
  status?: string;
  notes?: string;
  faculties?: IFacultyDTO;
}

export interface ITeacherFilter extends IPagingAndSortRequest {
  "teacherCode.contains"?: string;
  "name.contains"?: string;
  "position.equals"?: string;
  "qualification.equals"?: string;
  "facultiesId.equals"?: string;
}

//--------------------------student---------------------//
export interface IStudentDTO extends Auditing {
  id: number;
  studentCode?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  notes?: string;
  status?: string;
  dateEnrollment?: string;
  clasName?:string;
  courseYear?:string;
  faculties?: IFacultyDTO
}

export interface IStudentFilter extends IPagingAndSortRequest {
  "studentCode.contains"?: string;
  "phoneNumber.contains"?: string;
  "status.equals"?: string;
}

//--------------------------Faculty---------------------//
export interface IFacultyDTO extends Auditing {
  id: string;
  facultyCode?: string;
  facultyName?: string;
  description?: string;
  establishedDate?: string;
  phoneNumber?: string;
  location?: string;
  notes?: string;
  parentId?: string;
}

export interface IFacultyFilter extends IPagingAndSortRequest {
  "facultyCode.contains"?: string;
  "facultyName.contains"?: string;
  // "status.equals"?: string;
}


//--------------------------Faculty---------------------//
export interface IClassDTO extends Auditing {
  id: number;
  classCode?: string;
  className?: string;
  classroom?: string;
  credits?: number;
  numberOfSessions?: number;
  totalNumberOfStudents?: number;
  startDate?: string;
  endDate?: string;
  classType?: string;
  deliveryMode?: string;
  status?: boolean;
  notes?: string;
  description?: string;
  academicYear?: string;
  parentId?: string;
  teachers?: ITeacherDTO,
  course?: ICourseDTO
}

export interface IClassFilter extends IPagingAndSortRequest {
  "classCode.contains"?: string;
  "startDate.greaterThanOrEqual"?: string | null;
  "endDate.lessThanOrEqual"?: string | null;
  "status.equals"?: boolean;
  "classesId.equals"?: string | null;
  "teachersId.equals"?:string | null;
}



export interface IClassRegistrationsDTO extends Auditing {
  id: number;
  registerDate: string;
  status: string;
  remarks?: string;
  classes?: IClassDTO,
  student?: IStudentDTO,
  key?: number
}

export interface IClassRegistrationsFilter extends IPagingAndSortRequest {
  "classesId.equals"?: string;
  "teachersId.equals"?: string;
  "status.notIn"?: string[];
}


export interface IGradeDTO {
  id: number;
  gradesCode: string;
  credit: number;
  studyAttempt: number;
  examAttempt: number;
  processScore: number;
  examScore: number;
  score10: number;
  score4: number;
  letterGrade: string;
  evaluation: string;
  notes: string;
  status: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  student: IStudentDTO;
  classes: IClassDTO;
}

export interface IGradeFilter extends IPagingAndSortRequest {
  "classesId.equals"?: string | number | null;
  "status.equals"?: boolean;
}


export interface IConductScoreDTO {
  id: number;
  conductScoresCode: string;
  academicYear: string;
  score: number;
  classification: number;
  evaluation: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  student: IStudentDTO;
}


export interface IStatisticDTO {
  id: number;
  statisticsCode?: string;
  academicYear?: string;
  type?: string;
  notes?: string;
  status?: boolean;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

export interface IStatisticFilter {
  page: number;
  size: number;
  "status.equals"?: boolean;
  "type.equals"?:string;
  "academicYear.equals"?:string;
  // Thêm các filter khác nếu cần
}

export interface IStatisticDetailDTO {
  id: number;
  code?: string;
  totalScholarship?: number;
  graduationDate?: string;
  notes?: string;
  status?: boolean;
  score?:string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  student?: IStudentDTO;
  statistics?: IStatisticDTO;
}

export interface IClassUpdateDTO extends Auditing {
  id: number;
  classCode?: string;
  className?: string;
  classroom?: string;
  credits?: number;
  numberOfSessions?: number;
  totalNumberOfStudents?: number;
  startDate?: string;
  endDate?: string;
  classType?: string;
  deliveryMode?: string;
  status?: boolean;
  notes?: string;
  description?: string;
  academicYear?: string;
  parentId?: string;
  teachersId?: number,
  courseId?: number,
  studentIds?: number[],
  studentIdRemove?: number[];
}

export interface IClassUpdateDTO extends Auditing {
  id: number;
  classCode?: string;
  className?: string;
  classroom?: string;
  credits?: number;
  numberOfSessions?: number;
  totalNumberOfStudents?: number;
  startDate?: string;
  endDate?: string;
  classType?: string;
  deliveryMode?: string;
  status?: boolean;
  notes?: string;
  description?: string;
  academicYear?: string;
  parentId?: string;
  teachersId?: number,
  courseId?: number,
  studentIds?: number[],
  studentIdRemove?: number[];
}


export interface SemesterGradeFullSummary {
  studentId: string;
  fullName: string;
  academicYear: string;
  totalCredits: string;
  avgScore10: string;
  avgScore4: string;
  semesterRanking: string;
}

export interface SemesterSummaryResponse {
  summary: SemesterGradeFullSummary[];
  grades: IGradeDTO[];
  student: IStudentDTO;
}

export interface IMasterDataDTO extends Auditing {
  id: number;
  key?: string;
  code?: string;
  name?: string;
  description?: string;
  status?: string;
}

export interface IClassCourseDTO extends Auditing {
  id: number;
  courses?: IClassNameDTO[];
  facultyId?: number;
}

export interface IClassNameDTO{
  className?: string[];
  course?: string;
}

export interface IReportFilter {
  type: string;
  facultyId: number;
  academicYear: string;
  minTotalCredits: number;
  node: string;
}