import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Modal, notification, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApi from "../apis/get.api"; // Giả sử có phương thức getClasses
import postApi from "../apis/post.api";
import ClassesCreate from "../components/create/ClassesCreate";
import ClassesSearch from "../components/filter/ClassesSearch";
import { ClassTypes, DeliveryModes, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IClassFilter, IMasterDataDTO } from "../interfaces/course";
import { AxiosError } from "axios";

const Classes: React.FC = () => {
  const { confirm } = Modal;
  const navigate = useNavigate();
  const [classes, setClasses] = useState<IResponseN<IClassDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isReload, setIsReload] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [classReq, setClassReq] = useState<IClassFilter>({
    page: 0,
    size: 20,
    "sort": "lastModifiedDate,desc"
  });
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [academicYearM, setAcademicYear] = useState<IMasterDataDTO[]>([]);
  const columns: ColumnsType<IClassDTO> = [
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
    },
    {
      title: "Xóa",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Button
          color="danger" variant="solid"
          style={{ marginRight: '8px' }}
          disabled={!record?.status}
          onClick={() => confirmDelete(record.id)}
        >
          Hủy
        </Button>
      ),
    },
  ];

  const deleteClass = async (id: number) => {
    try {
      await postApi.deleteClass(id).then((response) => {
        setClassReq({ ...classReq, page: 0 })
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
    }
  }

  const confirmDelete = (id: number) => {
    confirm({
      title: 'Bạn có đồng ý xóa không?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          deleteClass(id)
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

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getMasterData = async () => {
    setLoading(true);
    try {
      const key = { "key.equals": "ACADEMIC", page: 0, size: 100000 }
      const fullQuery = toQueryString(key);
      const response = await getApi.getMasterData(fullQuery);
      setAcademicYear(response.data || []);
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

  const getList = async () => {
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

  const triggerFormEvent = (value: IClassFilter) => {
    setClassReq({
      ...value,
      page: classReq.page,
      size: classReq.size
    });
  }

  useEffect(() => {
    setIsReload(false);
    getList();
    getMasterData();
  }, [classReq, isReload])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Danh sách lớp học phần</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => setOpenFormCreate(true)}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <ClassesSearch req={classReq} triggerFormEvent={triggerFormEvent} />
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
          columns={columns}
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
              value={pageSize}
              onChange={(size: number) => {
                setClassReq({
                  ...classReq,
                  page: 0,
                  size: size,
                });
                setPageSize(size);
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
      <ClassesCreate
        open={openFormCreate}
        academicYear={academicYearM}
        onCancel={() => {
          setOpenFormCreate(false);
          getList();
        }}
      />
    </>
  );
};

export default Classes;
