import { Breadcrumb, Button, Col, DatePicker, Empty, Flex, Input, notification, Pagination, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import { renderText } from "../components/common";
import { CourseStatuses, handleError, PositionTeaches, QualificationTeaches, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassFilter, IFacultyDTO, ITeacherDTO } from "../interfaces/course";
import { AxiosError } from "axios";
import putApi from "../apis/put.api";
import FacultiesList from "./Faculties";

const { RangePicker } = DatePicker;

const TeachesDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idTeachers = params.get("id") || "";

  const [teaches, setTeaches] = useState<ITeacherDTO>({ id: 0 });
  const [classRegis, setClassRegis] = useState<IResponseN<IClassDTO[]>>();

  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [faculties, setFaculties] = useState<IFacultyDTO[]>();
  const [classRegisReq, setClassRegisReq] = useState<IClassFilter>({
    page: 0,
    size: 20,
    "teachersId.equals": idTeachers,
    "sort": "lastModifiedDate,desc"
  });

  // State mới: chỉnh sửa
  const [isEditMode, setIsEditMode] = useState(false);
  const [editValues, setEditValues] = useState<Partial<ITeacherDTO>>({});

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
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const getListClassRegis = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(classRegisReq);
      const response = await getApi.getClasses(fullQuery);
      setClassRegis(response);
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const getListFaculties = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString({ page: 0, size: 10000, "status.equals": true });
      const response = await getApi.getFaculties(fullQuery);
      setFaculties(response.data);
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getListClassRegis();
    getTeaches();
    getListFaculties();
  }, []);

  useEffect(() => {
    getListClassRegis();
  }, [classRegisReq]);

  const columnsClasses = [
    { title: "Mã lớp", dataIndex: ["classCode"], key: "classCode" },
    { title: "Tên lớp", dataIndex: ["className"], key: "className" },
    { title: "Phòng học", dataIndex: ["classroom"], key: "classroom" },
    { title: "Số tín chỉ", dataIndex: ["credits"], key: "credits" },
    { title: "Sĩ số", dataIndex: ["totalNumberOfStudents"], key: "totalNumberOfStudents" },
    {
      title: "Ngày bắt đầu", dataIndex: ["startDate"], key: "startDate",
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY") : ""
    },
    {
      title: "Ngày kết thúc", dataIndex: ["endDate"], key: "endDate",
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY") : ""
    },
    { title: "Năm học", dataIndex: ["academicYear"], key: "academicYear" },
    {
      title: "Ngày đăng ký", dataIndex: "createdDate", key: "createdDate",
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY") : ""
    },
    {
      title: "Trạng thái", dataIndex: ["status"], key: "status",
      render: (status: boolean) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      }
    },
    { title: "Ghi chú", dataIndex: "remarks", key: "notes", render: (text: string) => text || "-" }
  ];

  return (
    <>
      <Breadcrumb style={{ fontSize: '20px', paddingBottom: '10px' }}
        items={[
          { title: <Link to={`/teaches`}>Danh sách giảng viên</Link> },
          { title: <span style={{ fontWeight: 'bold' }}>Chi tiết giảng viên</span> },
        ]}
      />
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Chi tiết giảng viên {teaches?.teachersCode}</h3>
        </Flex>

        <Row style={{ margin: "5px", width: '100%', background: 'white', padding: '10px', borderRadius: '5px' }} className="d-flex ant-row-flex-space-around">
          <Col span={8} style={{ padding: "5px" }}>
            {isEditMode ? (
              <>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Mã giảng viên</label>
                  <Input
                    value={editValues.teachersCode}
                    onChange={e => setEditValues({ ...editValues, teachersCode: e.target.value })}
                    disabled // thường mã giảng viên không cho sửa
                  />
                </div>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Tên giảng viên</label>
                  <Input
                    value={editValues.name}
                    onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  />
                </div>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Email</label>
                  <Input
                    value={editValues.email}
                    onChange={e => setEditValues({ ...editValues, email: e.target.value })}
                  />
                </div>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Số điện thoại</label>
                  <Input
                    value={editValues.phoneNumber}
                    onChange={e => setEditValues({ ...editValues, phoneNumber: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <>
                {renderText("Mã giảng viên", teaches?.teachersCode || '')}
                {renderText("Tên giảng viên", teaches?.name || '')}
                {renderText("Email", teaches?.email || '')}
                {renderText("Số điện thoại", teaches?.phoneNumber || '')}
              </>
            )}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {isEditMode ? (
              <>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Ngày bắt đầu</label>
                  <DatePicker
                    style={{ width: "100%" }}
                    value={editValues.startDate ? dayjs(editValues.startDate) : undefined}
                    onChange={date => setEditValues({ ...editValues, startDate: date?.toISOString() })}
                    format="DD/MM/YYYY"
                  />
                </div>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Ngày kết thúc</label>
                  <DatePicker
                    style={{ width: "100%" }}
                    value={editValues.endDate ? dayjs(editValues.endDate) : undefined}
                    onChange={date => setEditValues({ ...editValues, endDate: date?.toISOString() })}
                    format="DD/MM/YYYY"
                  />
                </div>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Chức vụ</label>
                  <Select
                    style={{ width: '100%' }}
                    value={editValues.position}
                    options={PositionTeaches.map(x => ({ value: x.value, label: x.label }))}
                    onChange={value => setEditValues({ ...editValues, position: value })}
                  />
                </div>
              </>
            ) : (
              <>
                {renderText(
                  "Ngày bắt đầu",
                  teaches?.startDate ? dayjs(teaches?.startDate).format("DD/MM/YYYY") : ""
                )}
                {renderText(
                  "Ngày kết thúc",
                  teaches?.endDate ? dayjs(teaches?.endDate).format("DD/MM/YYYY") : ""
                )}
                {renderText("Chức vụ", teaches?.position || '')}
              </>
            )}
          </Col>

          <Col span={8} style={{ padding: "5px" }}>
            {isEditMode ? (
              <>
                <div className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Trình độ</label>
                  <Select
                    style={{ width: '100%' }}
                    value={editValues.qualification || ''}
                    options={QualificationTeaches.map(x => ({ value: x.value, label: x.label }))}
                    onChange={value => setEditValues({ ...editValues, qualification: value })}
                  />
                </div>
                <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Khoa:</label>
                  <Select
                    style={{ width: '100%' }}
                    value={editValues.faculties?.id}
                    options={faculties?.map(x => ({ value: x.id, label: x.facultyName }))}
                    onChange={value => setEditValues({ ...editValues, faculties: { id: value } })}
                    disabled
                  />
                </Row>
                <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <label>Trạng thái:</label>
                  <Select
                    style={{ width: '100%' }}
                    value={editValues.status ? true : false}
                    options={StatusType}
                    onChange={value => setEditValues({ ...editValues, status: value })}
                  />
                </Row>
              </>
            ) : (
              <>
                {renderText("Trình độ", QualificationTeaches.find((x) => x.value == (teaches?.qualification || ''))?.label || '')}
                <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <Col xs={14} sm={14} md={12} lg={10} xl={8}><h5>Khoa: </h5></Col>
                  <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                    <a onClick={() => navigate(`/faculties/details?id=${teaches?.faculties?.id}`)}>{teaches?.faculties?.facultyName || ''}</a>
                  </Col>
                </Row>
                <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
                  <Col xs={14} sm={14} md={12} lg={10} xl={8}><h5>Trạng thái: </h5></Col>
                  <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                    <Tag color={teaches?.status ? "green" : "red"}>
                      {teaches?.status ? "Hoạt động" : "Không hoạt động"}
                    </Tag>
                  </Col>
                </Row>
              </>
            )}
            <Flex gap="small" justify="flex-end">
              {!isEditMode ? (
                <Button type="primary" onClick={() => {
                  setEditValues({ ...teaches });
                  setIsEditMode(true);
                }}>
                  Cập nhật
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    onClick={async () => {
                      try {
                        await putApi.putTeaches(teaches.id, {
                          ...editValues,
                          startDate: editValues.startDate ? dayjs(editValues.startDate).toDate().toISOString() : undefined,
                          endDate: editValues.endDate ? dayjs(editValues.endDate).toDate().toISOString() : undefined,
                          lastModifiedDate: dayjs().toDate().toISOString()
                        });
                        notification.success({
                          message: "Cập nhật thành công",
                        });
                        setIsEditMode(false);
                        getTeaches();
                      } catch (error) {
                        notification.error({
                          message: "Lỗi",
                          description: "Cập nhật thất bại",
                        });
                      }
                    }}
                  >
                    Lưu
                  </Button>
                  <Button onClick={() => setIsEditMode(false)}>
                    Hủy
                  </Button>
                </>
              )}
            </Flex>
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
                  page: 0,
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
