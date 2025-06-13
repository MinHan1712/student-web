import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Flex, Form, Input, InputNumber, Modal, notification, Row, Select, Spin, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import postApi from "../apis/post.api";
import '../assets/css/style.css';
import { renderText } from "../components/common";
import { courseTypeOptions, QualificationTeaches } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassFilter, IGradeDTO, IGradeFilter } from "../interfaces/course";
import { AxiosError } from "axios";


const GradeScoreManager: React.FC = () => {
  const { confirm } = Modal;
  const [classes, setClasses] = useState<IResponseN<IClassDTO[]>>();
  const [classesItem, setClassesItem] = useState<IClassDTO>();
  const [listGrade, setListGrade] = useState<IGradeDTO[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const navigate = useNavigate();
  const [classReq, setClassReq] = useState<IClassFilter>({
    page: 0,
    size: 10020,
    "status.equals": true,
    "sort": "lastModifiedDate,desc"
  });

  const [gradeReq, setGradeReq] = useState<IGradeFilter>({
    page: 0,
    size: 20,
    "status.equals": true,
    "classesId.equals": 0,
    "sort": "lastModifiedDate,desc"
  });


  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getListClass = async () => {
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

  const getListGrade = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(gradeReq);
      const response = await getApi.getGrades(fullQuery);
      
      setListGrade(response.data || []);
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
    getListGrade();
    setIsEditing(false)
  }, [gradeReq])

  useEffect(() => {
    getListClass();
  }, [classReq])

  const updateGrades = async () => {
    setLoadingScreen(true);
    try {
      await postApi.createGrades(listGrade).then((response) => {
        // switch (response) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập điểm thành công',
        });
        setIsEditing(false);
      })
        .catch((err) => {
          const error = err as AxiosError;
          if (error.response?.status === 401) {
            notification.error({
              message: "Lỗi",
              description: "Hết phiên đăng nhập",
            });
            navigate('/login');
            return;
          }
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

  const columns: ColumnsType<IGradeDTO> = [
    {
      title: 'Mã bản ghi',
      dataIndex: 'gradesCode',
      key: "gradesCode",
      render: (_, record) => <span>{record.gradesCode}</span>,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: ["student", "studentCode"],
      key: "student.studentCode",
      render: (_, record) => <span>{record.student.studentCode}</span>,
    },
    {
      title: 'Tên sinh viên',
      dataIndex: ["student", "fullName"],
      key: "student.fullName",
      render: (_, record) => <span>{record.student.fullName}</span>,
    },
    {
      title: "Lớp",
      dataIndex: ["student", "courseYear"],
      key: "student.courseYear",
    },
    {
      title: "Khóa",
      dataIndex: ["student", "courseYear"],
      key: "student.courseYear",
    },
    {
      title: 'Tín chỉ',
      dataIndex: 'credit',
      key: 'credit',
      render: (_, record) => <span>{record.credit}</span>,
    },
    {
      title: 'Lần học',
      dataIndex: 'studyAttempt',
      key: 'studyAttempt',
      render: (_, record) => <span>{record.studyAttempt}</span>,
    },
    {
      title: 'Lần thi',
      dataIndex: 'examAttempt',
      key: 'examAttempt',
      render: (_, record) => <span>{record.examAttempt}</span>,
    },
    {
      title: 'Điểm quá trình',
      dataIndex: 'processScore',
      key: 'processScore',
      render: (_, record) =>
        isEditing ? (
          <InputNumber
            min={0}
            max={10}
            step={0.1}
            value={record.processScore}
            onChange={(value) =>
              handleScoreChange(record.id, 'processScore', value ?? 0)
            }
          />
        ) : (
          <span>{record.processScore}</span>
        ),
    },
    {
      title: 'Điểm thi',
      dataIndex: 'examScore',
      key: 'examScore',
      render: (_, record) =>
        isEditing ? (
          <InputNumber
            min={0}
            max={10}
            step={0.1}
            value={record.examScore}
            onChange={(value) =>
              handleScoreChange(record.id, 'examScore', value ?? 0)
            }
          />
        ) : (
          <span>{record.examScore}</span>
        ),
    },
    {
      title: 'Thang 10',
      dataIndex: 'score10',
      key: 'score10',
      render: (_, record) => (
        <span>{record.score10?.toFixed(2)}</span>
      )
    },
    {
      title: 'Thang 4',
      dataIndex: 'score4',
      key: 'score4',
      render: (_, record) => (
        <span>{record.score4?.toFixed(2)}</span>
      )
    },
    {
      title: 'Điểm chữ',
      dataIndex: 'letterGrade',
      key: 'letterGrade',
      render: (_, record) => (
        <span>{letterGradeLabelMap[record.letterGrade] || ''}</span>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluation',
      key: 'evaluation',
      render: (_, record) => (
        <span>{evaluationLabelMap[record.evaluation] || ''}</span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (_, record) =>
        isEditing ? (
          <Input
            value={record.notes}
            onChange={(e) =>
              handleChange(e.target.value, record.id, 'notes')
            }
          />
        ) : (
          <span>{record.notes}</span>
        ),
    }
  ];

  const handleChange = (value: any, key: number, field: keyof IGradeDTO) => {
    const newData = listGrade.map(item => {
      if (item.id === key) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setListGrade(newData);
  };

  const handleScoreChange = (id: number, field: 'processScore' | 'examScore', value: number) => {
    const newData = [...listGrade];
    const index = newData.findIndex((item) => item.id === id);

    if (index !== -1) {
      newData[index][field] = value;
      const { processScore = 0, examScore = 0 } = newData[index];

      const score10 = parseFloat(((processScore * 0.5) + (examScore * 0.5)).toFixed(2));
      const { score4, letterGrade, evaluation } = convertScore10To4AndEval(score10);

      newData[index].score10 = score10;
      newData[index].score4 = score4;
      newData[index].letterGrade = letterGrade;
      newData[index].evaluation = evaluation;

      setListGrade(newData);
    }
  };

  const convertScore10To4AndEval = (score10: number) => {
    let score4: number;
    let letterGrade: string;

    if (score10 >= 9.5) {
      score4 = 4.0;
      letterGrade = 'A+';
    } else if (score10 >= 8.5) {
      score4 = 3.8;
      letterGrade = 'A';
    } else if (score10 >= 8.0) {
      score4 = 3.5;
      letterGrade = 'B+';
    } else if (score10 >= 7.0) {
      score4 = 3.0;
      letterGrade = 'B';
    } else if (score10 >= 6.0) {
      score4 = 2.5;
      letterGrade = 'C+';
    } else if (score10 >= 5.5) {
      score4 = 2.0;
      letterGrade = 'C';
    } else if (score10 >= 4.5) {
      score4 = 1.5;
      letterGrade = 'D+';
    } else if (score10 >= 4.0) {
      score4 = 1.0;
      letterGrade = 'D';
    } else if (score10 >= 2.0) {
      score4 = 0.5;
      letterGrade = 'F+';
    } else {
      score4 = 0.0;
      letterGrade = 'F';
    }

    const evaluation = getEvaluation(score10);

    return { score4, letterGrade, evaluation };
  }

  const getEvaluation = (score10: number) => {
    if (score10 >= 4) {
      return 'Pass';
    } else {
      return 'Retake';
    }
  }

  const confirmCreateInvExport = () => {
    confirm({
      title: 'Bạn có đồng ý cập nhập điểm?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          updateGrades()
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

  const letterGradeLabelMap: Record<string, string> = {
    APlus: 'A+',
    A: 'A',
    BPlus: 'B+',
    B: 'B',
    CPlus: 'C+',
    C: 'C',
    DPlus: 'D+',
    D: 'D',
    FPlus: 'F+',
    F: 'F',
  };

  const evaluationLabelMap: Record<string, string> = {
    Pass: 'Đạt',
    Retake: 'Học lại',
    Deferment: 'Bảo lưu',
  };
  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }
  return (
    <>
      {loadingScreen ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />
      ) : (<>
        <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
          <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
            <h3 className="title">Nhập điểm thi</h3>
          </Flex>
          <div style={providerStyleContent}>
            <Form name="course_filter" className="common-form wrapper-form"
              style={{ width: '100%' }}>
              <Flex gap="middle" justify="space-between" align={'center'}
                style={{ width: '100%', padding: '5px' }}>
                <div style={{ width: '50%' }}>
                  <Form.Item
                    // {...formItemLayout}
                    labelAlign={"left"}
                    name={'id'}
                    label={
                      <span style={{ fontWeight: "550", fontSize: "14px" }}>Lớp học</span>
                    }
                  >
                    <Select
                      className="d-flex w-100 form-select-search "
                      style={{ minHeight: '30px' }}
                      size="middle"
                      optionLabelProp="label"
                      loading={loading}
                      onSelect={(selectedId: number) => {
                        const selectedClass = classes?.data?.find(c => c.id === selectedId);
                        if (selectedClass) {
                          setClassesItem(selectedClass);
                          setGradeReq({
                            ...gradeReq,
                            "classesId.equals": selectedId
                          });
                        }
                      }}
                      notFoundContent={classes?.data ? <Empty description="Không có dữ liệu" /> : null}
                    >
                      {classes?.data?.map((classes) => (
                        <Select.Option key={classes.id} value={classes.id} label={classes.classCode + "-" + classes.className}>
                          {classes.classCode + "-" + classes.className}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ width: '30%' }}>
                  <Flex style={{ width: '100%', justifyContent: 'flex-end' }}>
                    {isEditing ? (
                      <>
                        <Button
                          type="primary"
                          icon={<PlusCircleOutlined />}
                          onClick={confirmCreateInvExport}
                          style={{ marginRight: 8 }}
                        >
                          Cập nhật điểm
                        </Button>
                        <Button
                          danger
                          onClick={() => {
                            setIsEditing(false);
                            getListGrade();
                          }}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="button btn-add d-flex flex-row justify-content-center align-content-center"
                        type="primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
                        <span>Sửa điểm</span>
                      </Button>
                    )}
                  </Flex>
                </div></Flex>
            </Form>
          </div>
        </Flex>
        <Row style={{ margin: "5px", width: "100%", background: "white", padding: "10px", borderRadius: "5px" }}
          className="d-flex ant-row-flex-space-around">
          <Col span={8} style={{ padding: "5px" }} >
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Môn Học</h3>
            {renderText("Mã môn học", classesItem?.course?.courseCode || '')}
            {renderText("Tên môn học", classesItem?.course?.courseTitle || '')}
            {renderText("Số tín", classesItem?.course?.credits || '')}
            {renderText("Loại môn học", <Tag color={courseTypeOptions.find((x) => x.value == classesItem?.course?.courseType)?.color}>{courseTypeOptions.find((x) => x.value == classesItem?.course?.courseType)?.label || classesItem?.course?.courseType}</Tag>)}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={classesItem?.course?.status ? "green" : "red"}>
                  {classesItem?.course?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
            {renderText("Học kỳ", classesItem?.course?.semester || '')}
          </Col>
          <Col span={8} style={{ padding: "5px" }} >
            <h3 style={{ width: '100%', paddingBottom: '10px' }}></h3>
            {renderText("Số tín", classesItem?.course?.credits || '')}
            {renderText("Lý thuyết", classesItem?.course?.lecture || '')}
            {renderText("Thảo luận", classesItem?.course?.tutorialDiscussion || '')}
            {renderText("Thực hành", classesItem?.course?.practical || '')}
            {renderText("Phòng thí nghiệm", classesItem?.course?.laboratory || '')}
            {renderText("Tự học", classesItem?.course?.selfStudy || '')}
            {renderText("Số buổi học", classesItem?.course?.numberOfSessions || '')}
          </Col>
          <Col span={8} style={{ padding: "5px" }}>
            <h3 style={{ width: '100%', paddingBottom: '10px' }}>Giảng Viên</h3>
            {renderText("Mã giảng viên", classesItem?.teachers?.teachersCode || '')}
            {renderText("Tên giảng viên", classesItem?.teachers?.name || '')}
            {renderText("Email", classesItem?.teachers?.email || '')}
            {renderText("Số điện thoại", classesItem?.teachers?.phoneNumber || '')}
            {renderText("Trình độ", QualificationTeaches.find((x) => x.value == (classesItem?.teachers?.qualification || ''))?.label || '')}
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Khoa: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <a onClick={() => navigate(`/faculties/details?id=${classesItem?.teachers?.faculties?.id}`)}>{classesItem?.teachers?.faculties?.facultyName || ''}</a>
              </Col>
            </Row>
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={classesItem?.teachers?.status ? "green" : "red"}>
                  {classesItem?.teachers?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="table-wrapper" style={{ width: '100%' }}>
          <div className="table-container">
            <Table locale={{
              emptyText: (
                <Empty description="Chưa chọn sản phẩm nào" />
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
              dataSource={listGrade}
              pagination={false}
            />
          </div>
        </div>
      </>)}
    </>
  );
};

export default GradeScoreManager;