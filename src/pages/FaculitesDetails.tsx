import { Col, Empty, Flex, notification, Pagination, Row, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import { renderText } from "../components/common";
import { PositionTeaches, QualificationTeaches, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassFacu, ICourseFacultyDTO, ICourseFacultyFilter, IFacultyDTO, ITeacherDTO, ITeacherFilter } from "../interfaces/course";
import { AxiosError } from "axios";

const FacultiesDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idFaculty = params.get("id") || "";

  const [faculties, setFaculties] = useState<IFacultyDTO>({ id: '0' });
  const [courseFaculties, setCourseFaculties] = useState<IResponseN<ICourseFacultyDTO[]>>();
  const [teachers, setTeachers] = useState<IResponseN<ITeacherDTO[]>>();
  const [classScourse, setClassScourse] = useState<IResponseN<IClassFacu[]>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageSizeTeachers, setPageSizeTeachers] = useState(Number(selectPageSize[0].value));
  const [pageSizeCourse, setPageSizeCourse] = useState(Number(selectPageSize[0].value));
  const [pageSizeClassScourse, setPageSizeClassScourse] = useState(Number(selectPageSize[0].value));

  const [teachersReq, setTeachersReq] = useState<ITeacherFilter>({
    page: 0,
    size: 20,
    "facultiesId.equals": idFaculty,
    "sort": "lastModifiedDate,desc"
  });

  const [courseFaReq, setCourseFaReq] = useState<ICourseFacultyFilter>({
    page: 0,
    size: 20,
    "facultiesId.equals": idFaculty,
    "sort": "lastModifiedDate,desc"
  });

  const [classFaReq, setClassFaReq] = useState<ICourseFacultyFilter>({
    page: 0,
    size: 20,
    "facultiesId.equals": idFaculty,
    "sort": "lastModifiedDate,desc"
  });



  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getFaculty = async () => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getFaculty(idFaculty);

      setFaculties(response);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        notification.error({
          message: "Lỗi",
          description: "Hết phiên đăng nhập",
        });
        navigate('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getListCourseFaculties = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(courseFaReq);
      const response = await getApi.getCourseFaculties(fullQuery);

      setCourseFaculties(response);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        notification.error({
          message: "Lỗi",
          description: "Hết phiên đăng nhập",
        });
        navigate('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getListTeaches = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(teachersReq);
      const response = await getApi.getTeachers(fullQuery);

      setTeachers(response);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        notification.error({
          message: "Lỗi",
          description: "Hết phiên đăng nhập",
        });
        navigate('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const getListClassScourse = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(classFaReq);
      const response = await getApi.getClassScourse(fullQuery);
      setClassScourse(response);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        notification.error({
          message: "Lỗi",
          description: "Hết phiên đăng nhập",
        });
        navigate('/login');
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFaculty();
    getListTeaches();
    getListCourseFaculties();
    getListClassScourse();
  }, []);

  useEffect(() => {
    getListTeaches();
  }, [teachersReq]);

  useEffect(() => {
    getListCourseFaculties();
  }, [courseFaReq]);


  const columnsTeacher: ColumnsType<ITeacherDTO> = [
    {
      title: "Mã giảng viên",
      dataIndex: "teachersCode",
      key: "teachersCode",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {PositionTeaches.find((x) => x.value == text)?.label}
        </div>
      )
    },
    {
      title: "Trình độ",
      dataIndex: "qualification",
      key: "qualification",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {QualificationTeaches.find((x) => x.value == text)?.label}
        </div>
      )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
    },
  ];

  const courseColumns: ColumnsType<ICourseFacultyDTO> = [
    {
      title: "Mã môn học",
      dataIndex: ["course", "courseCode"],
      key: "course.courseCode",
      width: "10%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: ["course", "courseTitle"],
      key: "course.courseTitle",
      width: "20%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Số tín",
      dataIndex: ["course", "credits"],
      key: "course.credits",
      width: "10%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Lý thuyết",
      dataIndex: ["course", "lecture"],
      key: "course.lecture",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thảo luận",
      dataIndex: ["course", "tutorialDiscussion"],
      key: "course.tutorialDiscussion",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thực hành",
      dataIndex: ["course", "practical"],
      key: "course.practical",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Phòng thí nghiệm",
      dataIndex: ["course", "laboratory"],
      key: "course.laboratory",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tự học",
      dataIndex: ["course", "selfStudy"],
      key: "course.selfStudy",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Số buổi học",
      dataIndex: ["course", "numberOfSessions"],
      key: "course.numberOfSessions",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Loại môn học",
      dataIndex: ["course", "courseType"],
      key: "course.courseType",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: ["course", "status"],
      key: "course.status",
      width: "8%",
      align: "center",
      render: (status) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Học kỳ",
      dataIndex: ["course", "semester"],
      key: "course.semester",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    }];

  const classScoColumns: ColumnsType<IClassFacu> = [
    {
      title: "Tên lớp",
      dataIndex: "className",
      key: "className",
      // width: "250%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Khóa học",
      dataIndex: "courseYear",
      key: "courseYear",
      // width: "25%",
      align: "left",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
      ),
    },
  ];

  return (
    <>

      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Chi tiết khoa {faculties.facultyCode}</h3>
        </Flex>
        <Row style={{ margin: "5px", width: '100%', background: 'white', padding: '10px', borderRadius: '5px' }} className="d-flex ant-row-flex-space-around">
          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Mã khoa", faculties.facultyCode || '')}
            {renderText("Tên khoa", faculties.facultyName || '')}
            {renderText("Mô tả", faculties.description || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Ngày thành lập", faculties.establishedDate ? dayjs(faculties.establishedDate).format("DD/MM/YYYY") : "")}
            {renderText("Số điện thoại", faculties.phoneNumber || '')}
            {renderText("Vị trí", faculties.location || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            <div className="style-text-limit-number-line2">
              {renderText("Ghi chú", faculties.notes || '')}
            </div>
          </Col>
        </Row>
      </Flex>
      <div className="table-wrapper">
        <h3 className="title">Danh sách giảng viên</h3>
        <Table
          rowKey={(record) => record.id}
          size="small"
          scroll={{ x: 1024 }}
          bordered={false}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  {...props}
                  style={{ ...props.style, backgroundColor: "#012970", color: "#ffffff" }}
                />
              ),
            },
          }}
          columns={columnsTeacher}
          loading={loading}
          dataSource={teachers?.data}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                navigate(`/teaches/details?id=${record.id}`);
              },
            };
          }}
        />
        <Flex gap="middle" justify="space-between" align="center" style={{ paddingTop: "10px" }}>
          <Flex gap="middle" align="center">
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              value={pageSizeTeachers}
              onChange={(size: number) => {
                setTeachersReq({
                  ...teachersReq,
                  page: 0,
                  size: size,
                });
                setPageSizeTeachers(size);
              }}
            />
          </Flex>

          <Pagination
            total={teachers?.total || 0}
            current={teachersReq.page || 0 + 1}
            pageSize={teachersReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setTeachersReq({
                ...teachersReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>

      <div className="table-wrapper" style={{ paddingTop: '40px' }}>
        <h3 className="title">Danh sách môn học</h3>
        <Table
          rowKey={(record) => record.id}
          size="small"
          scroll={{ x: 1024 }}
          bordered={false}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  {...props}
                  style={{ ...props.style, backgroundColor: "#012970", color: "#ffffff" }}
                />
              ),
            },
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                navigate(`/course/details?id=${record?.course.id}`);
              },
            };
          }}
          columns={courseColumns}
          loading={loading}
          dataSource={courseFaculties?.data}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        />
        <Flex gap="middle" justify="space-between" align="center" style={{ paddingTop: "10px" }}>
          <Flex gap="middle" align="center">
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              value={pageSizeCourse}
              onChange={(size: number) => {
                setCourseFaReq({
                  ...courseFaReq,
                  page: 0,
                  size: size,
                });
                setPageSizeCourse(size);
              }}
            />
          </Flex>

          <Pagination
            total={courseFaculties?.total || 0}
            current={courseFaReq.page || 0 + 1}
            pageSize={courseFaReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setCourseFaReq({
                ...courseFaReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>

      <div className="table-wrapper" style={{ paddingTop: '40px', width: '50%' }}>
        <h3 className="title">Danh sách các lớp</h3>
        <Table
          rowKey={(record) => record.id}
          size="small"
          bordered={false}
          components={{
            header: {
              cell: (props: any) => (
                <th
                  {...props}
                  style={{ ...props.style, backgroundColor: "#012970", color: "#ffffff" }}
                />
              ),
            },
          }}
          columns={classScoColumns}
          loading={loading}
          dataSource={classScourse?.data}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        />
        <Flex gap="middle" justify="space-between" align="center" style={{ paddingTop: "10px" }}>
          <Flex gap="middle" align="center">
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              value={pageSizeClassScourse}
              onChange={(size: number) => {
                setClassFaReq({
                  ...classFaReq,
                  page: 0,
                  size: size,
                });
                setPageSizeClassScourse(size);
              }}
            />
          </Flex>

          <Pagination
            total={classScourse?.total || 0}
            current={classFaReq.page || 0 + 1}
            pageSize={classFaReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setClassFaReq({
                ...classFaReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default FacultiesDetails;
