import {
  DeleteOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Button, Empty, Flex, Modal, notification, Pagination, Select, Tag, Tooltip } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import '../assets/css/style.css';
import CourseCreate from "../components/create/courseCreate";
import CourseSearch from "../components/filter/CourseSearch";
import { courseTypeOptions, handleError, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { ICourseDTO, ICourseFilter } from "../interfaces/course";
import putApi from "../apis/put.api";
import dayjs from "dayjs";
const Course: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [isReload, setIsReload] = useState(false);
  const navigate = useNavigate();
  const [courseRes, setCourseRes] = useState<IResponseN<ICourseDTO[]>>();
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [courseReq, setCourseReq] = useState<ICourseFilter>({
    page: 0,
    size: 20,
    "sort": "lastModifiedDate,desc"
  });

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };
  const getListCourse = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(courseReq);
      const response = await getApi.getCourses(fullQuery);
      setCourseRes(response);

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
    } finally { setLoading(false); }
  }

  const triggerFormEvent = (value: ICourseFilter) => {
    setCourseReq({
      ...value,
      page: courseReq.page,
      size: courseReq.size
    });
  }

  const courseColumns: ColumnsType<ICourseDTO> = [
    {
      title: "Mã môn học",
      dataIndex: "courseCode",
      key: "courseCode",
      width: "10%",
      align: "left",
      render: (_, record) => (
        <Link to={`/course/details?id=${record.id}`}>
          {record.courseCode}
        </Link>
      ),
    },
    {
      title: "Tên môn học",
      dataIndex: "courseTitle",
      key: "courseTitle",
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
      dataIndex: "credits",
      key: "credits",
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
      dataIndex: "lecture",
      key: "lecture",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thảo luận",
      dataIndex: "tutorialDiscussion",
      key: "tutorialDiscussion",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Thực hành",
      dataIndex: "practical",
      key: "practical",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Phòng thí nghiệm",
      dataIndex: "laboratory",
      key: "laboratory",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Tự học",
      dataIndex: "selfStudy",
      key: "selfStudy",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Số buổi học",
      dataIndex: "numberOfSessions",
      key: "numberOfSessions",
      width: "8%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Loại môn học",
      dataIndex: "courseType",
      key: "courseType",
      width: "10%",
      align: "center",
      render: (value) => {
        const statusInfo = courseTypeOptions.find((x) => x.value == value);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || value}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "8%",
      align: "center",
      render: (status) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      width: "10%",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Xóa",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tooltip title={!record.status ? "Không thể xóa bản ghi không đang hoạt động" : "Xóa"}>
          <Button
            type="text"
            icon={<DeleteOutlined style={{ fontSize: '20px' }} />}
            onClick={() => confirmDelete(record.id)}
            disabled={!record.status} // disable khi record.status = true
            danger
          />
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    setIsReload(false);
    getListCourse();
    console.log('request', courseReq);
  }, [courseReq, isReload])

  const { confirm } = Modal;
  const confirmDelete = (id: string) => {
    confirm({
      title: 'Bạn có đồng ý xóa không?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          deleteItem(id)
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

  const deleteItem = async (id: string) => {
    try {
      await putApi.putCourses(id, { "id": id, "status": false, "lastModifiedDate": dayjs().toDate().toISOString() });
      notification.success({
        message: "Thông báo",
        description: "Xóa môn học thành công",
      });
      getListCourse();
    } catch (err: any) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Môn học</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => { setOpenFormCreate(true) }}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <CourseSearch courseReq={courseReq} triggerFormEvent={triggerFormEvent} />
      </Flex>
      <div className="table-wrapper">
        <Table
          rowKey={(record) => record.id}
          size="small"
          scroll={{ x: 1024 }}
          bordered={false}
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
          columns={courseColumns}
          loading={loading}
          dataSource={courseRes?.data}
          pagination={false}
        />
        <Flex gap="middle" justify="space-between" align={'center'} style={{ paddingTop: '10px' }}>
          <Flex gap="middle" justify="flex-start" align={'center'}>
            <h5>Hiển thị</h5>
            <Select
              style={{ width: 70 }}
              options={selectPageSize}
              className='me-2 ms-2'
              value={pageSize || selectPageSize[0].value}
              onChange={(size: number) => {
                setCourseReq({
                  ...courseReq,
                  page: 0,
                  size: size
                });
                setPageSize(size);
              }} />
            {/* <h5> Tổng số {CourseRes || 0}  nhà cung cấp</h5> */}
          </Flex>


          <Pagination
            total={courseRes?.total || 0}
            current={courseReq.page || 0 + 1}
            pageSize={courseReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setCourseReq({
                ...courseReq,
                page: page - 1,
              });
            }} />
        </Flex>

      </div>
      <CourseCreate
        getList={getListCourse}
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
        }}
      />
    </>
  );
};

export default Course;
