import { CaretRightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Col, Collapse, CollapseProps, Descriptions, Empty, Flex, Row, Spin, Table, Tag, notification } from 'antd';
import React, { CSSProperties, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import getDetailsApi from '../apis/get.details.api';
import { evaluationMap, evaluationOptions, letterGradeOptions, StudentStatuses } from '../constants/general.constant';
import { SemesterSummaryResponse } from '../interfaces/course';
import { renderText } from "../components/common";
const StudentGradePage = () => {
  const [data, setData] = useState<SemesterSummaryResponse>({ summary: [], grades: [], student: { id: 0 } });
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idStudent = params.get("id") || "";
  const navigate = useNavigate();
  const fetchGrades = async () => {
    try {
      const response = await getDetailsApi.getSummary(idStudent);
      setData(response);
    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Không thể tải dữ liệu bảng điểm',
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Mã lớp",
      dataIndex: ["classes", "classCode"],
    },
    {
      title: "Tên học phần",
      dataIndex: ["classes", "course", "courseTitle"],
    },
    {
      title: "Số tín chỉ",
      dataIndex: "credit",
    },
    {
      title: "Lần học",
      dataIndex: "studyAttempt",
    },
    {
      title: "Lần thi",
      dataIndex: "examAttempt",
    },
    {
      title: "Điểm hệ 10",
      dataIndex: "score10",
    },
    {
      title: "Điểm hệ 4",
      dataIndex: "score4",
    },
    {
      title: 'Điểm chữ',
      dataIndex: 'letterGrade',
      render: (value: string) => getLetterGradeLabel(value),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluation',
      render: (value: string) => getEvaluationLabel(value),
    }
  ];

  const columns1 =
    [
      { title: 'Năm học', dataIndex: 'academicYear', render: (value: string) => <strong>{value}</strong>, },
      { title: 'Tổng TC', dataIndex: 'totalCredits', render: (value: string) => <strong>{value}</strong>, },
      { title: 'ĐTB hệ 10', dataIndex: 'avgScore10', render: (value: string) => <strong>{value}</strong>, },
      { title: 'ĐTB hệ 4', dataIndex: 'avgScore4', render: (value: string) => <strong>{value}</strong>, },
      { title: 'Xếp loại', dataIndex: 'semesterRanking', render: (value: string) => <strong>{value}</strong>, },
    ]
  // Nếu hiển thị điểm chữ trong bảng hoặc mô tả:
  const getLetterGradeLabel = (value: string) =>
    letterGradeOptions.find((item) => item.value === value)?.label || value;
  const getEvaluationLabel = (value: string) =>
    evaluationOptions.find((item) => item.value === value)?.label || value;

  const col1 = [
    { label: 'Họ tên', value: data.student.fullName },
    { label: 'Mã SV', value: data.student.studentCode },
    {
      label: 'Ngày sinh',
      value: data?.student?.dateOfBirth
        ? new Date(data.student.dateOfBirth).toLocaleDateString()
        : '',
    }
  ]
  const col2 = [
    { label: 'Giới tính', value: data.student.gender },
    { label: 'Số điện thoại', value: data.student.phoneNumber },
    { label: 'Email', value: data.student.email }
  ]

  const col3 = [
    { label: 'Địa chỉ', value: data.student.address },
    { label: 'Ghi chú', value: data.student.notes },
    { label: 'Trạng thái', value: data.student.status },
    {
      label: 'Ngày nhập học',
      value: data?.student?.dateEnrollment
        ? new Date(data.student.dateEnrollment).toLocaleDateString()
        : '',
    }]
  const col4 = [
    { label: 'Lớp', value: data.student.clasName },
    { label: 'Khoa', value: <a onClick={() => navigate(`/faculties/details?id=${data.student?.faculties?.id}`)}>{data.student?.faculties?.facultyName || ''}</a> },
    { label: 'Khóa', value: data.student.courseYear },
    {
      label: 'Ngày nhập học',
      value: data?.student?.dateEnrollment
        ? new Date(data.student.dateEnrollment).toLocaleDateString()
        : '',
    }]

  const getItems = (panelStyle: CSSProperties): CollapseProps['items'] => [
    {
      key: '1',
      label: <strong>Bảng tổng kết các năm học</strong>,
      children: (
        <Table locale={{
          emptyText: (
            <Empty description="Không có dữ liệu" />
          )
        }}
          rowKey={(record) => record.academicYear || ''}
          size="small"
          style={{
            marginTop: '5px', overflowY: 'scroll'
          }}
          scroll={{ x: 900 }}
          components={{
            header: {
              cell: (props: any) => {
                return (
                  <th
                    {...props}
                    style={{ ...props.style, backgroundColor: '#012970', color: '#ffffff' }}
                  />
                );
              },
            },
          }}
          className="table table-hover provider-table"
          columns={columns1}
          dataSource={data.summary || []}
          pagination={false}
        />
      ),
      style: panelStyle,
    },
    {
      key: '2',
      label: <strong>Thông tin sinh viên</strong>,
      children: (
        <Row style={{ margin: "5px", width: "100%", background: "white", padding: "10px", borderRadius: "5px" }}
          className="d-flex ant-row-flex-space-around">
          <Col span={6} style={{ padding: "5px" }} >
            {col1.map(({ label, value }) => renderText(label, value || ''))}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={StudentStatuses.find((s) => s.value === data.student.status)?.color}>
                  {StudentStatuses.find((s) => s.value === data.student.status)?.label}
                </Tag>
              </Col>
            </Row>
          </Col>
          <Col span={6} style={{ padding: "5px" }} >
            {col2.map(({ label, value }) => renderText(label, value || ''))}
          </Col>
          <Col span={6} style={{ padding: "5px" }} >
            {col3.map(({ label, value }) => renderText(label, value || ''))}
          </Col>
          <Col span={6} style={{ padding: "5px" }} >
            {col4.map(({ label, value }) => renderText(label, value || ''))}
          </Col>
        </Row>
      ),
      style: panelStyle,
    },
  ];

  const panelStyle: React.CSSProperties = {
    marginBottom: 12,
    background: '#f7f7f7',
    borderRadius: 4,
    border: '1px solid #e8e8e8',
  };

  useEffect(() => {
    fetchGrades();
  }, [idStudent]);

  return (
    <>
      {loadingScreen ? (
        <Spin indicator={< LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
      ) : (<>
        <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
          <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
            <h3 className="title">Thông tin sinh viên-{data.student.studentCode}</h3>
          </Flex>
        </Flex>

        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={getItems(panelStyle)}
        />

        <div className="table-wrapper" style={{ width: '100%' }}>
          <div className="table-container">
            <Table locale={{
              emptyText: (
                <Empty description="Không có dữ liệu" />
              )
            }}
              rowKey={(record) => record.id || ''}
              size="small"
              style={{
                marginTop: '5px', height: '611px', overflowY: 'scroll'
              }}
              scroll={{ x: 900 }}
              components={{
                header: {
                  cell: (props: any) => {
                    return (
                      <th
                        {...props}
                        style={{ ...props.style, backgroundColor: '#012970', color: '#ffffff' }}
                      />
                    );
                  },
                },
              }}
              className="table table-hover provider-table"
              columns={columns}
              dataSource={data?.grades || []}
              pagination={false}
            />
          </div>
        </div>
      </>)}
    </>
  );
};

export default StudentGradePage;
