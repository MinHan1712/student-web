import { Col, Empty, Flex, notification, Pagination, Row, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import { renderText } from "../components/common";
import { ClassTypes, courseTypeOptions, DeliveryModes, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassFilter, ICourseDTO, ICourseFacultyDTO, ICourseFacultyFilter } from "../interfaces/course";
import { AxiosError } from "axios";

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idParams = params.get("id") || "";

  const [course, setCourses] = useState<ICourseDTO>({ id: idParams });
  const [courseFaculties, setCourseFaculties] = useState<IResponseN<ICourseFacultyDTO[]>>();
  const [classes, setClasses] = useState<IResponseN<IClassDTO[]>>();


  const [loading, setLoading] = useState<boolean>(false);
  const [pageSizeClasses, setPageSizeClasses] = useState(Number(selectPageSize[0].value));
  const [pageSizeFacCourse, setPageSizeFacCourse] = useState(Number(selectPageSize[0].value));

  const [classReq, setClassReq] = useState<IClassFilter>({
    page: 0,
    size: 20,
    "courseId.equals": idParams,
    "sort": "lastModifiedDate,desc"
  });

  const [courseFaReq, setCourseFaReq] = useState<ICourseFacultyFilter>({
    page: 0,
    size: 20,
    "courseId.equals": idParams,
    "sort": "lastModifiedDate,desc"
  });

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getCourse = async () => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getCourses(idParams);
      setCourses(response);
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

  const getListClasses = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(classReq);
      const response = await getApi.getClasses(fullQuery);
      setClasses(response);
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
    getCourse();
    getListClasses();
    getListCourseFaculties();
  }, []);

  useEffect(() => {
    getListCourseFaculties();
  }, [courseFaReq]);

  useEffect(() => {
    getListClasses();
  }, [classReq]);


  const columnsClasses: ColumnsType<IClassDTO> = [
    {
      title: "Mã lớp",
      dataIndex: "classCode",
      key: "classCode",
    },
    {
      title: "Tên lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Môn học",
      dataIndex: ["course", "courseTitle"],
      key: "course.courseTitle"
    },
    {
      title: "Phòng học",
      dataIndex: "classroom",
      key: "classroom",
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credits",
      key: "credits",
    },
    {
      title: "Sĩ số",
      dataIndex: "totalNumberOfStudents",
      key: "totalNumberOfStudents",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : '',
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : '',
    },
    {
      title: "Loại lớp",
      dataIndex: "classType",
      key: "classType",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {ClassTypes.find((x) => x.value == text)?.label}
        </div>
      )
    },
    {
      title: "Hình thức học",
      dataIndex: "deliveryMode",
      key: "deliveryMode",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {DeliveryModes.find((x) => x.value == text)?.label}
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
      title: "Năm học",
      dataIndex: "academicYear",
      key: "academicYear",
    }
  ];

  const courseColumns: ColumnsType<ICourseFacultyDTO> = [
    {
      title: "Mã khoa",
      dataIndex: ["faculties", "facultyCode"],
      key: "faculties.facultyCode",
    },
    {
      title: "Tên khoa",
      dataIndex: ["faculties", "facultyName"],
      key: "faculties.facultyName",
    },
    {
      title: "Mô tả",
      dataIndex: ["faculties", "description"],
      key: "faculties.description",
      render: (text) => text || "-",
    },
    {
      title: "Ngày thành lập",
      dataIndex: ["faculties", "establishedDate"],
      key: "faculties.establishedDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : '',
    },
    {
      title: "Số điện thoại",
      dataIndex: ["faculties", "phoneNumber"],
      key: "faculties.phoneNumber",
    },
    {
      title: "Vị trí",
      dataIndex: ["faculties", "location"],
      key: "faculties.location",
    },
    {
      title: "Ghi chú",
      dataIndex: ["faculties", "notes"],
      key: "faculties.notes",
      render: (text) => text || "-",
    },
  ];
  return (
    <>

      <Flex gap="middle" vertical justify="space-between" align="center" style={{ width: '100%' }}>
        <Flex gap="middle" justify="flex-start" align="center" style={{ width: '100%' }}>
          <h3 className="title">Chi tiết học phần {course?.courseCode}</h3>
        </Flex>

        <Row
          style={{
            margin: "5px",
            width: '100%',
            background: 'white',
            padding: '10px',
            borderRadius: '5px'
          }}
          className="d-flex ant-row-flex-space-around"
        >
          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Mã học phần", course?.courseCode || '')}
            {renderText("Tên học phần", course?.courseTitle || '')}
            {renderText("Số tín chỉ", course?.credits?.toString() || '')}
            {renderText("Số buổi", course?.numberOfSessions || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Lý thuyết", course?.lecture || '')}
            {renderText("Thảo luận/Tutorial", course?.tutorialDiscussion || '')}
            {renderText("Thực hành", course?.practical || '')}
            {renderText("Thí nghiệm", course?.laboratory || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Tự học", course?.selfStudy || '')}
            {renderText("Loại học phần", <Tag color={courseTypeOptions.find((x) => x.value == course?.courseType)?.color}>{courseTypeOptions.find((x) => x.value == course?.courseType)?.label || ''}</Tag>)}
            {renderText("Học kỳ", course?.semester || '')}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={StatusType.find((s) => s.value === course?.status)?.color}>
                  {StatusType.find((s) => s.value === course?.status)?.label}
                </Tag>
              </Col>
            </Row>
            <div className="style-text-limit-number-line2">
              {renderText("Ghi chú", course?.notes || '')}
            </div>
          </Col>
        </Row>
      </Flex>


      <div className="table-wrapper" style={{ paddingTop: '40px' }}>
        <h3 className="title">Danh sách khoa</h3>
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
                navigate(`/faculties/details?id=${record?.faculties.id}`);
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
              value={pageSizeFacCourse}
              onChange={(size: number) => {
                setCourseFaReq({
                  ...courseFaReq,
                  page: 0,
                  size: size,
                });
                setPageSizeFacCourse(size);
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


      <div className="table-wrapper">
        <h3 className="title">Danh sách lớp</h3>
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
          columns={columnsClasses}
          loading={loading}
          dataSource={classes?.data}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                navigate(`/classes/details?id=${record.id}`);
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
              value={pageSizeClasses}
              onChange={(size: number) => {
                setClassReq({
                  ...classReq,
                  page: 0,
                  size: size,
                });
                setPageSizeClasses(size);
              }}
            />
          </Flex>

          <Pagination
            total={classes?.total || 0}
            current={classReq.page || 0 + 1}
            pageSize={classReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setClassReq({
                ...classReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default CourseDetails;
