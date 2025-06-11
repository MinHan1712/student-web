import { CaretRightOutlined, LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Collapse, CollapseProps, DatePicker, Empty, Flex, Form, Input, Modal, notification, Row, Select, Spin, Table, Tag, theme } from "antd";
import dayjs from 'dayjs';
import { CSSProperties, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import postApi from "../apis/post.api";
import '../assets/css/style.css';
import { renderText } from "../components/common";
import { ClassTypes, CourseStatuses, DeliveryModes, formItemLayout, genderMap, QualificationTeaches } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassRegistrationsDTO, IClassRegistrationsFilter, IClassUpdateDTO, IStudentDTO, IStudentFilter } from "../interfaces/course";

const ClassManager: React.FC = () => {
  const { confirm } = Modal;
  const [classForm] = Form.useForm();
  const [classes, setClasses] = useState<IClassDTO>({ id: 0 });
  const [students, setStudents] = useState<IResponseN<IStudentDTO[]>>();
  const [listClassRegister, setClassRegistrations] = useState<IClassRegistrationsDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [classesUpdate, setClassUpdate] = useState<IClassUpdateDTO>();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStudents, setIsEditingStudents] = useState(false);
  const [originalRegistrations, setOriginalRegistrations] = useState<IClassRegistrationsDTO[]>([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idClass = params.get("id") || "";

  const navigate = useNavigate();
  const [studentReq, setStudentReq] = useState<IStudentFilter>({
    page: 0,
    size: 20,
    "status.equals": "Studying"
  });

  const [classRegisterReq, setClassRegisterReq] = useState<IClassRegistrationsFilter>({
    page: 0,
    size: 20,
    "status.notIn": ['Cancelled', 'Failed'],
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
      setClassUpdate(convertToClassUpdateDTO(response));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListStudent = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(studentReq);
      const response = await getApi.getStudents(fullQuery);
      setStudents(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListClassRegistrations = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(classRegisterReq);
      const response = await getApi.getClassRegistrations(fullQuery);
      setClassRegistrations(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const convertToClassUpdateDTO = ({
    teachers,
    course,
    ...rest
  }: IClassDTO): IClassUpdateDTO => ({
    ...rest,
    id: classes.id,
    teachersId: teachers?.id,
    courseId: course?.id,
    studentIds: [],
    studentIdRemove: [],
  });

  useEffect(() => {
    getListClassRegistrations();
  }, [classRegisterReq])

  useEffect(() => {
    getListStudent();
  }, [studentReq])

  useEffect(() => {
    getClasses();
  }, [])

  const updateClass = async (value: IClassUpdateDTO) => {
    setLoadingScreen(true);
    try {
      await postApi.updateClass(value?.id || classes.id || 0, value).then((response) => {
        setIsEditing(false);
        setIsEditingStudents(false);
      })
        .catch(() => {
          notification['error']({
            message: "Lỗi",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
        })

    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally { setLoadingScreen(false); }
  }

  const columns = [
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
      title: "Thao tác",
      key: "action",
      render: (_: any, record: IClassRegistrationsDTO) => (
        <Button
          danger
          disabled={!isEditingStudents || loading}
          onClick={() => {
            const studentId = record.student?.id || 0;
            if (!studentId) return;

            // 1. Xoá khỏi danh sách đăng ký
            setClassRegistrations(prev =>
              prev.filter(item => item.student?.id !== studentId)
            );

            // 2. Cập nhật classUpdate
            setClassUpdate(prev => {
              if (!prev) return prev;

              const updatedStudentIds = (prev.studentIds || []).filter(
                id => id !== studentId
              );

              const alreadyInRemove = (prev.studentIdRemove || []).includes(studentId);
              const updatedStudentIdRemove = alreadyInRemove
                ? prev.studentIdRemove
                : [...(prev.studentIdRemove || []), studentId];

              return {
                ...prev,
                studentIds: updatedStudentIds,
                studentIdRemove: updatedStudentIdRemove,
              };
            });
          }}
        >
          Xoá
        </Button>
      ),
    }

  ];

  const onScrollSelectStudent = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setStudentReq({
        ...studentReq,
        page: studentReq.page || 1 + 1,
      })
    }
  };

  const confirmCreateInvExport = (value: IClassUpdateDTO) => {
    confirm({
      title: 'Bạn có đồng ý cập nhập không?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          console.log(value, classes);
          updateClass({
            ...value,
            id: classes.id
          })
            .then(() => {
              resolve();
            })
            .catch(() => {
              notification['error']({
                message: "Lỗi",
                description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
              });
              resolve();
            });
        });
      },
      onCancel() { },
    });
  }

  const classFields = [
    {
      label: "Mã lớp",
      value: classesUpdate?.classCode || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="classCode"
          label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Mã lớp</span>}
        >
          <Input placeholder="Tự động sinh mã lớp" disabled />
        </Form.Item>
      ),
    },
    {
      label: "Tên lớp",
      value: classesUpdate?.className || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="className"
          label="Tên lớp"
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      label: "Phòng học",
      value: classesUpdate?.classroom || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="classroom"
          label="Phòng học"
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      label: "Số tín chỉ",
      value: classesUpdate?.credits || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name={["credits"]}
          label="Số tín chỉ"
        >
          <Input disabled type="number" />
        </Form.Item>
      ),
    },
  ];


  const classFields2 = [
    {
      label: "Số buổi học",
      value: classesUpdate?.numberOfSessions || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="numberOfSessions"
          label="Số buổi học"
        >
          <Input type="number" />
        </Form.Item>
      ),
    },
    {
      label: "Tổng số sinh viên",
      value: classesUpdate?.totalNumberOfStudents || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="totalNumberOfStudents"
          label="Tổng số sinh viên"
        >
          <Input type="number" />
        </Form.Item>
      ),
    },
    {
      label: "Loại lớp",
      value: ClassTypes.find(x => x.value == (classesUpdate?.classType || ''))?.label || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="classType"
          label="Loại lớp"
        >
          <Select options={ClassTypes} />
        </Form.Item>
      ),
    },
    {
      label: "Hình thức giảng dạy",
      value: DeliveryModes.find(x => x.value == (classesUpdate?.deliveryMode || ''))?.label || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="deliveryMode"
          label="Hình thức giảng dạy"
        >
          <Select options={DeliveryModes} />
        </Form.Item>
      ),
    },
  ];


  const classFields3 = [
    {
      label: "Năm học",
      value: classesUpdate?.academicYear || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="academicYear"
          label="Năm học"
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      label: "Ngày bắt đầu",
      value: classesUpdate?.startDate ? new Date(classesUpdate.startDate).toLocaleDateString() : '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="startDate"
          label="Ngày bắt đầu"
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      ),
    },
    {
      label: "Ngày kết thúc",
      value: classesUpdate?.endDate ? new Date(classesUpdate.endDate).toLocaleDateString() : '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="endDate"
          label="Ngày kết thúc"
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
      ),
    },
  ];


  const classFields4 = [
    {
      label: "Ghi chú",
      value: classesUpdate?.notes || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="notes"
          label="Ghi chú"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      ),
    },
    {
      label: "Mô tả",
      value: classesUpdate?.description || '',
      valueedit: (
        <Form.Item
          {...formItemLayout}
          name="description"
          label="Mô tả"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      ),
    },
  ];


  const courseFields = [
    { label: "Mã môn học", value: classes?.course?.courseCode || '' },
    { label: "Tên môn học", value: classes?.course?.courseTitle || '' },
    { label: "Số tín", value: classes?.course?.credits || '' },
    { label: "Loại môn học", value: classes?.course?.courseType || '' }
  ];

  const courseFields1 = [
    { label: "Lý thuyết", value: classes?.course?.lecture || '' },
    { label: "Thảo luận", value: classes?.course?.tutorialDiscussion || '' },
    { label: "Thực hành", value: classes?.course?.practical || '' },
    { label: "Phòng thí nghiệm", value: classes?.course?.laboratory || '' },
    { label: "Tự học", value: classes?.course?.selfStudy || '' },
    { label: "Số buổi học", value: classes?.course?.numberOfSessions || '' }
  ];

  const teacherFields = [
    { label: "Mã giảng viên", value: classes?.teachers?.teachersCode || '' },
    { label: "Tên giảng viên", value: classes?.teachers?.name || '' },
    { label: "Email", value: classes?.teachers?.email || '' },
    { label: "Số điện thoại", value: classes?.teachers?.phoneNumber || '' }
  ];

  const teacherFields1 = [
    {
      label: "Ngày bắt đầu",
      value: classes?.teachers?.startDate
        ? dayjs(classes?.teachers?.startDate).format("DD/MM/YYYY")
        : ''
    },
    {
      label: "Ngày kết thúc",
      value: classes?.teachers?.endDate
        ? dayjs(classes?.teachers?.endDate).format("DD/MM/YYYY")
        : ''
    },
    { label: "Chức vụ", value: classes?.teachers?.position || '' },
    {
      label: "Trình độ",
      value:
        QualificationTeaches.find(
          (x) => x.value == (classes?.teachers?.qualification || '')
        )?.label || ''
    }
  ];

  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '10px'
  }

  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    borderRadius: token.borderRadiusLG,
    border: 'none',
    background: '#ffff'
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleFormSubmit = (values: IClassUpdateDTO) => {
    const update = {
      ...values,
      id: classes.id,
      teachersId: classesUpdate?.teachersId,
      courseId: classesUpdate?.courseId,
    }
    console.log("Submitted values:", update);
    setClassUpdate(update);
    confirmCreateInvExport(update);
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
    {
      key: '1',
      label: 'Thông tin lớp học phần',
      style: panelStyle,
      children: <>
        <Flex style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <div style={{ width: '90%' }}>
            <Form
              form={classForm}
              layout="vertical"
              onFinish={handleFormSubmit}
            >
              <Row
                style={{
                  margin: "5px",
                  width: "100%",
                  background: "white",
                  padding: "10px",
                  borderRadius: "5px"
                }}
                className="d-flex ant-row-flex-space-around"
              >
                {[classFields, classFields2, classFields3, classFields4].map((fields, colIndex) => (
                  <Col key={colIndex} span={6} style={{ padding: "5px" }}>
                    {fields.map((field, index) => (
                      <div key={index} style={{ marginBottom: 12 }}>
                        {isEditing ? field.valueedit : (
                          <div>
                            <strong>{field.label}:</strong> {field.value}
                          </div>
                        )}
                      </div>
                    ))}
                  </Col>
                ))}
              </Row>
            </Form>
          </div>
          <div style={{ width: '10%' }}>
            <Flex style={{ width: '100%', justifyContent: 'flex-end', marginBottom: 10 }}>
              {!isEditing ? (
                <Button
                  className="button btn-add"
                  type="primary"
                  onClick={handleEditToggle}
                >
                  <PlusCircleOutlined />
                  <span> Sửa</span>
                </Button>
              ) : (
                <>
                  <Button
                    style={{ marginRight: '8px' }}
                    onClick={() => {
                      handleEditToggle();
                      const studentIds = classesUpdate?.studentIds ?? [];
                      const studentRemove = classesUpdate?.studentIdRemove ?? [];

                      convertToClassUpdateDTO(classes);

                      setClassUpdate({
                        ...classesUpdate,
                        studentIds: studentIds,
                        studentIdRemove: studentRemove,
                        id: classes.id
                      });
                    }
                    }
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    style={{ marginLeft: '8px' }}
                    onClick={() => classForm.submit()}
                  >
                    Cập nhật
                  </Button>
                </>
              )}
            </Flex>

          </div>
        </Flex >
      </>,
    },
    {
      key: '2',
      label: 'Thông tin môn học và giảng viên',
      style: panelStyle,
      children: <>
        <Row style={{ margin: "5px", width: "100%", background: "white", padding: "10px", borderRadius: "5px" }}
          className="d-flex ant-row-flex-space-around">
          <Col span={6} style={{ padding: "5px" }} >
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Môn Học</h3>
            {courseFields.map(({ label, value }) => renderText(label, value || ''))}
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

          <Col span={6} style={{ padding: "5px" }} >
            <h3 style={{ width: '100%', paddingBottom: '10px' }}></h3>
            {courseFields1.map(({ label, value }) => renderText(label, value || ''))}
          </Col>

          <Col span={6} style={{ padding: "5px" }}>
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Giảng Viên</h3>
            {teacherFields.map(({ label, value }) => renderText(label, value || ''))}
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

          <Col span={6} style={{ padding: "5px" }}>
            <h3 style={{ width: '100%', paddingBottom: '10px' }}></h3>
            {teacherFields1.map(({ label, value }) => renderText(label, value || ''))}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Khoa: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <a onClick={() => navigate(`/faculties/details?id=${classes?.teachers?.faculties?.id}`)}>{classes?.teachers?.faculties?.facultyName || ''}</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </>,
    }
  ];
  useEffect(() => {
    if (isEditing && classesUpdate) {
      classForm.setFieldsValue({
        ...classesUpdate,
        startDate: classesUpdate.startDate ? dayjs(classesUpdate.startDate) : null,
        endDate: classesUpdate.endDate ? dayjs(classesUpdate.endDate) : null,
      });
    }
  }, [isEditing, classesUpdate]);

  const handleStartEditing = () => {
    setOriginalRegistrations([...listClassRegister]);
    setIsEditingStudents(true);
  };
  const handleCancelEditing = () => {
    setClassRegistrations(originalRegistrations);
    setIsEditingStudents(false);
  };

  return (
    <>
      {loadingScreen ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
      ) : (<>
        <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
          <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
            <h3 className="title">Quản lý lớp học phần</h3>
          </Flex>
          <div style={providerStyleContent}>
            {isEditingStudents && (
              <Form name="student_edit_form" className="wrapper-form">
                <Form.Item label="Sinh viên" style={{ fontWeight: 'bold' }}>
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn sinh viên"
                    optionLabelProp="label"
                    onPopupScroll={onScrollSelectStudent}
                    onSearch={(value) => {
                      console.log(value);
                      setStudentReq({
                        ...studentReq,
                        page: 0,
                        "studentCode.contains": value
                      })
                    }}
                    onSelect={(selectedId: number) => {
                      const selectedStudent = students?.data?.find(c => c.id === selectedId);
                      if (!selectedStudent) return;

                      setClassUpdate((prev) => ({
                        ...prev!,
                        studentIds: Array.from(new Set([...(prev?.studentIds || []), selectedStudent.id])),
                        studentIdRemove: (prev?.studentIdRemove || []).filter(id => id !== selectedStudent.id),
                      }));

                      setClassRegistrations(prev => {
                        const alreadyExists = prev.some(reg => reg.student?.id === selectedStudent?.id);
                        if (alreadyExists) return prev;

                        return [
                          ...prev,
                          {
                            id: selectedId,
                            registerDate: new Date().toISOString(),
                            status: "InProgress",
                            student: selectedStudent,
                            classes: classes,
                          },
                        ];
                      });
                    }}
                  >
                    {students?.data?.map((student) => (
                      <Select.Option key={student.id} value={student.id} label={student.studentCode}>
                        {student.studentCode + " - " + student.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            )}
          </div>
        </Flex>

        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={getItems(panelStyle)}
        />


        <Flex style={{ width: '100%', justifyContent: 'flex-end' }}>
          {!isEditingStudents ? (
            <Button type="primary" onClick={handleStartEditing}>
              <PlusCircleOutlined />
              <span>Thêm sinh viên</span>
            </Button>
          ) : (
            <>
              <Button onClick={handleCancelEditing}>Hủy</Button>
              <Button type="primary" onClick={() => confirmCreateInvExport(classesUpdate || { id: classes.id })}>
                Cập nhật
              </Button>
            </>
          )}
        </Flex>

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
              dataSource={listClassRegister}
              pagination={false}
            />
          </div>
        </div>
      </>)}
    </>
  );
};

export default ClassManager;