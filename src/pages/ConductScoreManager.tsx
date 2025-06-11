import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Form, InputNumber, Modal, notification, Select, Spin, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import postApi from "../apis/post.api";
import '../assets/css/style.css';
import { evaluationLabelMap, formItemLayout } from "../constants/general.constant";
import { IClassCourseDTO, IClassFilter, IConductScoreDTO, IFacultyDTO, IGradeFilter, IMasterDataDTO } from "../interfaces/course";
import getDetailsApi from "../apis/get.details.api";


const ConductScoreManager: React.FC = () => {
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [listConduct, setListConduct] = useState<IConductScoreDTO[]>();
  const [listFaculty, setListFaculty] = useState<IFacultyDTO[]>([]);
  const [listClassCourse, setListClassCourse] = useState<IClassCourseDTO>();

  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([]);
  const [academicYearM, setAcademicYear] = useState<IMasterDataDTO[]>([]);


  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [classReq, setClassReq] = useState<IClassFilter>({
    page: 0,
    size: 20,
    "status.equals": true
  });

  const [conductReq, setConductReq] = useState({
    "classIName": ""
  });


  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getListClassName = async (id: number) => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getClassCourse(id);
      setListClassCourse(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListConductScores = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(conductReq);
      const response = await getApi.getConductScores(fullQuery);
      setListConduct(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListFaculty = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString({ page: 0, size: 20 });
      const response = await getApi.getFaculties(fullQuery);
      setListFaculty(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createScoreConduct = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(conductReq);
      const response = await postApi.createCoursesA(fullQuery);
      getListConductScores();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getMasterData = async () => {
    setLoading(true);
    try {
      const key = { "key.equals": "ACADEMIC", page: 0, size: 100000 }
      const fullQuery = toQueryString(key);
      const response = await getApi.getMasterData(fullQuery);
      setAcademicYear(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListConductScores();
  }, [conductReq])

  useEffect(() => {
    getListFaculty();
    getMasterData();
  }, [])

  const updateConduct = async () => {
    setLoadingScreen(true);
    try {
      await postApi.createConduct(listConduct).then((response) => {
        // switch (response) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập điểm thành công',
        });
        setIsEditing(false);
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

  const columns: ColumnsType<IConductScoreDTO> = [
    {
      title: 'Mã bản ghi',
      dataIndex: 'conductScoresCode',
      key: 'conductScoresCode',
      render: (_, record) => <strong>{record.conductScoresCode}</strong>,
    },
    {
      title: 'Mã SV',
      dataIndex: ['student', 'studentCode'],
      key: 'studentCode',
      render: (_, record) => <strong>{record.student?.studentCode}</strong>,
    },
    {
      title: 'Sinh viên',
      dataIndex: ['student', 'fullName'],
      key: 'studentName',
      render: (_, record) => <span>{record.student?.fullName}</span>,
    },
    {
      title: 'Năm học',
      dataIndex: 'academicYear',
      key: 'academicYear',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (_, record) => (
        isEditing ? (
          <InputNumber
          style={{width: '50%'}}
            value={record.score}
            onChange={(value) => {
              const score = value || 0;
              const evaluation = getEvaluation(score);
              handleChange(score, record.id, 'score');
              handleChange(evaluation, record.id, 'evaluation');
            }}
          />
        ) : (
          <span>{record.score}</span>
        )
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluation',
      key: 'evaluation',
      render: (_, record) => (
        <span>{evaluationLabelMap[record.evaluation] || ''}</span>
      ),
    }
  ];


  const onScrollSelectProduct = (event: any) => {
    var target = event.target
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setClassReq({
        ...classReq,
        page: classReq.page || 1 + 1,
      })
      target.scrollTo(0, target.scrollHeight);
    }
  }

  const confirmCreateInvExport = () => {
    confirm({
      title: 'Bạn có đồng ý cập nhập điểm?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          updateConduct()
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
  const handleChange = (value: number | string, id: number, field: 'score' | 'evaluation') => {
    setListConduct(prev => prev?.map(item =>
      item.id === id
        ? {
          ...item,
          [field]: value,
        }
        : item));
  }

  const getEvaluation = (score: number) => {
    if (score >= 85) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 50) return 'Average';
    return 'Poor';
  }
  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    // flexDirection: 'column',
    width: '100%',
  }

  // Danh sách khóa học
  const courseOptions = listClassCourse?.courses?.map(c => ({
    label: c.course,
    value: c.course!,
  })) || [];

  // Khi chọn khóa học
  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course);
    const matched = listClassCourse?.courses?.find(c => c.course === course);
    const classes = matched?.className || [];

    setClassOptions(classes.map(name => ({ label: name, value: name })));
    form.setFieldsValue({ className: undefined });
  };

  return (
    <>
      {loadingScreen ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
      ) : (<>
        <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
          <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
            <h3 className="title">Nhập điểm rèn luyện</h3>
          </Flex>
          <div style={providerStyleContent}>
            <Form form={form} name="course_filter" className="common-form wrapper-form"
              style={{ width: '100%' }}>
              <Flex gap="middle" justify="space-between" align={'center'}
                style={{ width: '100%', padding: '5px' }}>
                <div style={{ width: '30%' }}>
                  <Form.Item
                    {...formItemLayout}
                    labelAlign={"left"}
                    name={'facultyId'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Khoa</span>
                    }
                    rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
                  >
                    <Select
                      className="d-flex w-100 form-select-search "
                      // style={{ width: '100%' }}
                      size="middle"
                      optionLabelProp="label"
                      onPopupScroll={onScrollSelectProduct}
                      loading={loading}
                      onSelect={(selectedId: number) => {
                        getListClassName(selectedId);
                      }}
                      notFoundContent={listConduct ? <Empty description="Không có dữ liệu" /> : null}
                    >
                      {listFaculty?.map((faculty) => (
                        <Select.Option key={faculty.id} value={faculty.id} label={faculty.facultyCode}>
                          {faculty.facultyCode + "-" + faculty.facultyName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                </div>

                <div style={{ width: '30%' }}>
                  <Form.Item
                    name="course"
                    label="Khóa học"
                    rules={[{ required: true, message: 'Vui lòng chọn khóa học' }]}
                  >
                    <Select
                      placeholder="Chọn khóa học"
                      options={courseOptions}
                      loading={loading}
                      onSelect={handleSelectCourse}
                    />
                  </Form.Item>
                </div>

                <div style={{ width: '30%' }}>
                  <Form.Item
                    name="classIName"
                    label="Lớp học"
                    rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
                  >
                    <Select
                      placeholder="Chọn lớp học"
                      options={classOptions}
                      disabled={!selectedCourse}
                      notFoundContent={<Empty description="Không có lớp học" />}
                    />
                  </Form.Item>
                </div>

                <div style={{ width: '30%' }}>
                  <Form.Item
                    {...formItemLayout}
                    labelAlign={"left"}
                    name={'academicYear'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Năm học</span>
                    }
                    rules={[{ required: true, message: 'Vui lòng chọn năm học' }]}
                  >
                    <Select
                      placeholder="Chọn năm học"
                      disabled={!academicYearM}
                      notFoundContent={
                        academicYearM && academicYearM.length === 0 ? (
                          <Empty description="Không có năm học" />
                        ) : null
                      }
                    >
                      {academicYearM?.map((item) => (
                        <Select.Option key={item.code + "-" + item.id} value={item.code} label={item.name}>
                          {item.code + "-" + item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                </div>
                <div style={{ width: '30%' }}>
                  <Flex>
                    {
                      <Button className="button btn-add d-flex flex-row justify-content-center align-content-center"
                        type="primary"
                        onClick={async () => {
                          try {
                            const values = await form.validateFields();
                            setConductReq(prev => ({
                              ...prev,
                              ['facultyId']: values['facultyId'],
                              ['classIName']: values['classIName'],
                              ['academicYear']: values['academicYear'],
                              ['course']: values['course']
                            }));
                          } catch (error) {
                            notification.error({
                              message: 'Thiếu thông tin',
                              description: 'Vui lòng chọn đầy đủ Khoa, Lớp và Năm học trước khi tìm kiếm.',
                            });
                          }

                        }}
                      >
                        Tìm kiếm
                      </Button>
                    }
                    <Button className="button btn-add d-flex flex-row justify-content-center align-content-center"
                      type="primary"
                      onClick={async () => {
                        try {
                          const values = await form.validateFields();
                          setConductReq(prev => ({
                            ...prev,
                            ['facultyId']: values['facultyId'],
                            ['classIName']: values['classIName'],
                            ['academicYear']: values['academicYear'],
                            ['course']: values['course']
                          }));
                          createScoreConduct();
                        } catch (error) {
                          notification.error({
                            message: 'Thiếu thông tin',
                            description: 'Vui lòng chọn đầy đủ Khoa, Lớp và Năm học trước khi tìm kiếm.',
                          });
                        }

                      }}
                    >
                      Tạo
                    </Button>
                  </Flex>


                </div>

              </Flex>
            </Form>
          </div>
        </Flex>
        <div className="table-wrapper">
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
            className="table table-hover provider-table"
            columns={columns}
            dataSource={listConduct}
            pagination={false}
          />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          {
            isEditing ? (
              <Flex gap="small">
                <Button
                  type="primary"
                  onClick={() => confirmCreateInvExport()}
                  icon={<PlusCircleOutlined />}
                >
                  Cập nhật điểm
                </Button>
                <Button
                  danger
                  onClick={() => {
                    setIsEditing(false);
                    getListConductScores();
                  }}
                >
                  Hủy
                </Button>
              </Flex>
            ) : (
              <Button
                className="button btn-add d-flex flex-row justify-content-center align-content-center"
                type="primary"
                onClick={async () => {
                  try {
                    await form.validateFields();
                    setIsEditing(true);
                  } catch (error) {
                    notification.error({
                      message: 'Thiếu thông tin',
                      description: 'Vui lòng chọn đầy đủ Khoa, Lớp và Năm học trước khi sửa điểm.',
                    });
                  }
                }}
                disabled={listConduct == null || listConduct.length == 0 ? true : false}
              >
                <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
                <span>Sửa điểm</span>
              </Button>
            )
          }
        </div>
      </>)
      }
    </>
  );
};

export default ConductScoreManager;