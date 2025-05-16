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
  studentCode: string;
  fullName: string;
  dateOfBirth: string; 
  gender: 'M' | 'F' | string; 
  address: string;
  phoneNumber: string;
  email: string;
  notes?: string;
  status: string;
  dateEnrollment: string; 
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
  "status.equals"?: string;
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
  "teachers.equals"?: string;
}