import React, { useEffect, useState } from "react";
import { Table, Empty, Flex, Select, Pagination, Row, Col, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import getApi from "../apis/get.api";
import { CourseStatuses, genderMap, PositionTeaches, QualificationTeaches, selectPageSize, StatusType, StudentStatuses } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassRegistrationsDTO, IClassRegistrationsFilter, ICourseDTO, ICourseFacultyDTO, ICourseFacultyFilter, ICourseFilter, IFacultyDTO, IFacultyFilter, ITeacherDTO, ITeacherFilter } from "../interfaces/course";
import { renderText } from "../components/common";
import getDetailsApi from "../apis/get.details.api";
import { format } from "path";
import { useLocation, useNavigate } from 'react-router-dom';

const ClassesDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idClass = params.get("id") || "";

  const [classes, setClasses] = useState<IClassDTO>({ id: 0 });
  const [classRegis, setClassRegis] = useState<IResponseN<IClassRegistrationsDTO[]>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));

  const [classRegisReq, setClassRegisReq] = useState<IClassRegistrationsFilter>({
    page: 0,
    size: 20,
    "classesId.equals": idClass
  });

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getClasses = async () => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getClasses(idClass);
      setClasses(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListClassRegis = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(classRegisReq);
      const response = await getApi.getClassRegistrations(fullQuery);
      setClassRegis(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListClassRegis();
    getClasses();
  }, []);

  useEffect(() => {
    getListClassRegis();
  }, [classRegisReq]);

  const columnsStudent = [
    {
      title: "Mã sinh viên",
      dataIndex: ["student", "studentCode"],
      key: "studentCode",
    },
    {
      title: "Họ và tên",
      dataIndex: ["student", "fullName"],
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: ["student", "dateOfBirth"],
      key: "dateOfBirth",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Giới tính",
      dataIndex: ["student", "gender"],
      key: "gender",
      render: (text: string) => (
        <div className="style-text-limit-number-line2">
          {genderMap.find((x) => x.value === text)?.label}
        </div>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registerDate",
      key: "registerDate",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Số điện thoại",
      dataIndex: ["student", "phoneNumber"],
      key: "phoneNumber",
    },
    {
      title: "Ghi chú",
      dataIndex: "remarks",
      key: "notes",
      render: (text: string) => text || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const stat = CourseStatuses.find((x) => x.value === status);
        return <Tag color={stat?.color}>{stat?.label || status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "remarks",
      key: "remarks",
      render: (text: string) => text || "-",
    }];

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Chi tiết lớp học phần {classes.classCode}</h3>
        </Flex>
        <Row style={{ margin: "5px", width: "100%", background: "white", padding: "10px", borderRadius: "5px" }}
          className="d-flex ant-row-flex-space-around">
          <Col span={12} style={{ padding: "5px" }} >
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Môn Học</h3>
            {renderText("Mã môn học", classes?.course?.courseCode || '')}
            {renderText("Tên môn học", classes?.course?.courseTitle || '')}
            {renderText("Số tín", classes?.course?.credits || '')}
            {renderText("Lý thuyết", classes?.course?.lecture || '')}
            {renderText("Thảo luận", classes?.course?.tutorialDiscussion || '')}
            {renderText("Thực hành", classes?.course?.practical || '')}
            {renderText("Phòng thí nghiệm", classes?.course?.laboratory || '')}
            {renderText("Tự học", classes?.course?.selfStudy || '')}
            {renderText("Số buổi học", classes?.course?.numberOfSessions || '')}
            {renderText("Loại môn học", classes?.course?.courseType || '')}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={classes?.course?.status ? "green" : "red"}>
                  {classes?.course?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
            {renderText("Học kỳ", classes?.course?.semester || '')}
          </Col>

          <Col span={12} style={{ padding: "5px" }}>
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Giảng Viên</h3>
            {renderText("Mã giảng viên", classes?.teachers?.teachersCode || '')}
            {renderText("Tên giảng viên", classes?.teachers?.name || '')}
            {renderText("Email", classes?.teachers?.email || '')}
            {renderText("Số điện thoại", classes?.teachers?.phoneNumber || '')}
            {renderText(
              "Ngày bắt đầu",
              classes?.teachers?.startDate ? dayjs(classes?.teachers?.startDate).format("DD/MM/YYYY") : ""
            )}
            {renderText(
              "Ngày kết thúc",
              classes?.teachers?.endDate ? dayjs(classes?.teachers?.endDate).format("DD/MM/YYYY") : ""
            )}
            {renderText("Chức vụ", classes?.teachers?.position || '')}
            {renderText("Trình độ", QualificationTeaches.find((x) => x.value == (classes?.teachers?.qualification || ''))?.label || '')}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Khoa: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <a onClick={() => navigate(`/faculties/details?id=${classes?.teachers?.faculties?.id}`)}>{classes?.teachers?.faculties?.facultyName || ''}</a>
              </Col>
            </Row>
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={classes?.teachers?.status ? "green" : "red"}>
                  {classes?.teachers?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
          </Col>
        </Row>
      </Flex>
      <div className="table-wrapper" style={{ width: '100%', paddingTop: '10px' }}>
        <h3 className="title" style={{ width: '100%', paddingBottom: '10px' }}>Danh sách sinh viên đăng ký</h3>
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
          columns={columnsStudent}
          loading={loading}
          dataSource={classRegis?.data}
          pagination={false}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
        />
        <Flex gap="middle" justify="space-between" align="center" style={{ paddingTop: "10px" }}>
          <Flex gap="middle" align="center">
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              value={pageSize}
              onChange={(size: number) => {
                setClassRegisReq({
                  ...classRegisReq,
                  page: 1,
                  size: size,
                });
                setPageSize(size);
              }}
            />
          </Flex>

          <Pagination
            total={classRegis?.total || 0}
            current={classRegisReq.page || 0 + 1}
            pageSize={classRegisReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setClassRegisReq({
                ...classRegisReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default ClassesDetails;
