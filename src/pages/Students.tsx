import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Modal, notification, Pagination, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import putApi from "../apis/put.api";
import StudentCreate from "../components/create/StudentCreate";
import StudentsSearch from "../components/filter/StudentsSearch";
import { genderMap, handleError, selectPageSize, StudentStatuses } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IFacultyDTO, IStudentDTO, IStudentFilter } from "../interfaces/course";

const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<IResponseN<IStudentDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isReload, setIsReload] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [studentReq, setStudentReq] = useState<IStudentFilter>({
    page: 0,
    size: 20,
    "sort": "lastModifiedDate,desc"
  });
  const [faculties, setFaculties] = useState<IFacultyDTO[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<IStudentDTO | undefined>(undefined);
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const columns: ColumnsType<IStudentDTO> = [
    {
      title: "Mã sinh viên",
      dataIndex: "studentCode",
      render: (_, record) => (
        <Link to={`/student/details?id=${record.id}`}>
          {record.studentCode}
        </Link>
      ),
    },
    {
      title: "Lớp",
      dataIndex: "clasName",
      key: "clasName",
    },
    {
      title: "Khóa",
      dataIndex: "courseYear",
      key: "courseYear",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {genderMap.find((x) => x.value == text)?.label}
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = StudentStatuses.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Ngày nhập học",
      dataIndex: "dateEnrollment",
      key: "dateEnrollment",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "",
    },
    {
      title: "Xóa",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tooltip title={record.status === 'Deleted' ? "Không thể xóa bản ghi đang không hoạt động" : "Xóa"}>
          <Button
            type="text"
            icon={<DeleteOutlined style={{ fontSize: '20px' }} />}
            onClick={() => confirmDelete(record.id)}
            disabled={record.status === 'Deleted'} // disable khi record.status = true
            danger
          />
        </Tooltip>),
    },
  ];

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getList = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(studentReq);
      const response = await getApi.getStudents(fullQuery);

      setStudents(response);
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
    setIsReload(false);
    getList();
  }, [studentReq]);

  useEffect(() => {
    getListFaculties();
  }, []);

  const triggerFormEvent = (value: IStudentFilter) => {
    setStudentReq({
      ...value,
      page: studentReq.page,
      size: studentReq.size
    });
  }

  const { confirm } = Modal;
  const confirmDelete = (id: number) => {
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

  const deleteItem = async (id: number) => {
    try {
      await putApi.putStudent(id, { "id": id, "status": "Deleted", "lastModifiedDate": dayjs().toDate().toISOString() });
      notification.success({
        message: "Thông báo",
        description: "Xóa sinh viên thành công",
      });
      getList();
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
          <h3 className="title">Danh sách sinh viên</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => { setOpenFormCreate(true) }}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <StudentsSearch req={studentReq} triggerFormEvent={triggerFormEvent} />
      </Flex >
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
          dataSource={students?.data}
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
                setStudentReq({
                  ...studentReq,
                  page: 0,
                  size: size,
                });
                setPageSize(size);
              }}

            />
          </Flex>

          <Pagination
            total={students?.total || 0}
            current={studentReq.page || 0 + 1}
            pageSize={studentReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setStudentReq({
                ...studentReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
      <StudentCreate
        faculties={faculties}
        getList={getList}
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
        }}
      />
    </>
  );
};

export default StudentsList;
