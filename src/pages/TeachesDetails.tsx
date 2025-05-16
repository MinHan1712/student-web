import { Col, Empty, Flex, Pagination, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import { renderText } from "../components/common";
import { CourseStatuses, QualificationTeaches, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassRegistrationsDTO, IClassRegistrationsFilter, ITeacherDTO } from "../interfaces/course";

const TeachesDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idTeachers = params.get("id") || "";

  const [teaches, setTeaches] = useState<ITeacherDTO>({ id: 0 });
  const [classRegis, setClassRegis] = useState<IResponseN<IClassRegistrationsDTO[]>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));

  const [classRegisReq, setClassRegisReq] = useState<IClassRegistrationsFilter>({
    page: 0,
    size: 20,
    "teachers.equals": idTeachers
  });

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getTeaches = async () => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getTeaches(idTeachers);
      setTeaches(response);
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
    getTeaches();
  }, []);

  useEffect(() => {
    getListClassRegis();
  }, [classRegisReq]);

  const columnsClasses = [
    {
      title: "Mã lớp",
      dataIndex: ["classes", "classCode"],
      key: "classCode",
    },
    {
      title: "Tên lớp",
      dataIndex: ["classes", "className"],
      key: "className",
    },
    {
      title: "Phòng học",
      dataIndex: ["classes", "classroom"],
      key: "classroom",
    },
    {
      title: "Số tín chỉ",
      dataIndex: ["classes", "credits"],
      key: "credits",
    },
    {
      title: "Sĩ số",
      dataIndex: ["classes", "totalNumberOfStudents"],
      key: "totalNumberOfStudents",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: ["classes", "startDate"],
      key: "startDate",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: ["classes", "endDate"],
      key: "endDate",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: ["classes", "status"],
      key: "status",
      render: (status: boolean) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Năm học",
      dataIndex: ["classes", "academicYear"],
      key: "academicYear",
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registerDate",
      key: "registerDate",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
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
          <h3 className="title">Chi tiết giảng viên {teaches?.teachersCode}</h3>
        </Flex>

        <Row style={{ margin: "5px", width: '100%', background: 'white', padding: '10px', borderRadius: '5px' }} className="d-flex ant-row-flex-space-around">
          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Mã giảng viên", teaches?.teachersCode || '')}
            {renderText("Tên giảng viên", teaches?.name || '')}
            {renderText("Email", teaches?.email || '')}
            {renderText("Số điện thoại", teaches?.phoneNumber || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText(
              "Ngày bắt đầu",
              teaches?.startDate ? dayjs(teaches?.startDate).format("DD/MM/YYYY") : ""
            )}
            {renderText(
              "Ngày kết thúc",
              teaches?.endDate ? dayjs(teaches?.endDate).format("DD/MM/YYYY") : ""
            )}
            {renderText("Chức vụ", teaches?.position || '')}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {renderText("Trình độ", QualificationTeaches.find((x) => x.value == (teaches?.qualification || ''))?.label || '')}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Khoa: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <a onClick={() => navigate(`/faculties/details?id=${teaches?.faculties?.id}`)}>{teaches?.faculties?.facultyName || ''}</a>
              </Col>
            </Row>
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={teaches?.status ? "green" : "red"}>
                  {teaches?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
          </Col>
        </Row>
      </Flex>
      <div className="table-wrapper" style={{ width: '100%', paddingTop: '10px' }}>
        <h3 className="title" style={{ width: '100%', paddingBottom: '10px' }}>Danh sách lớp</h3>
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

export default TeachesDetails;
