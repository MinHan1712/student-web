import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Modal, notification, Pagination, Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import FacultyCreate from "../components/create/FacultyCreate";
import FaculitiesSearch from "../components/filter/FaculitiesSearch";
import { handleError, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IFacultyDTO, IFacultyFilter } from "../interfaces/course";
import putApi from "../apis/put.api";
const FacultiesList: React.FC = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<IResponseN<IFacultyDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openFormCreate, setOpenFormCreate] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [facultyReq, setFacultyReq] = useState<IFacultyFilter>({
    page: 0,
    size: 20,
    "sort": "lastModifiedDate,desc"
  });

  const columns: ColumnsType<IFacultyDTO> = [
    {
      title: "Mã khoa",
      dataIndex: "facultyCode",
      key: "facultyCode",
      render: (_, record) => (
        <Link to={`/faculties/details?id=${record.id}`}>
          {record.facultyCode}
        </Link>
      ),
    },
    {
      title: "Tên khoa",
      dataIndex: "facultyName",
      key: "facultyName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => text || "-",
    },
    {
      title: "Ngày thành lập",
      dataIndex: "establishedDate",
      key: "establishedDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY") : "",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean) => {
        const statusInfo = StatusType.find((x) => x.value == status);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || status}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
    },
    {
      title: "Xóa",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Tooltip title={!record.status ? "Không thể xóa bản ghi đang không hoạt động" : "Xóa"}>
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

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getList = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(facultyReq);
      const response = await getApi.getFaculties(fullQuery);

      setFaculties(response);
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const deleteFaculty = async (id: string) => {
    try {
      await putApi.putFaculty(id, { "id": id, "status": false, lastModifiedDate: dayjs().toDate().toISOString() });
      notification.success({
        message: "Thông báo",
        description: "Xóa khoa thành công",
      });
      getList();
    } catch (err: any) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  const { confirm } = Modal;
  const confirmDelete = (id: string) => {
    confirm({
      title: 'Bạn có đồng ý xóa không?',
      okText: "Đồng ý",
      cancelText: 'Hủy',
      async onOk() {
        return new Promise<void>((resolve, reject) => {
          deleteFaculty(id)
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

  useEffect(() => {
    getList();
  }, [facultyReq]);


  const triggerFormEvent = (value: IFacultyFilter) => {
    setFacultyReq({
      ...value,
      page: facultyReq.page,
      size: facultyReq.size
    });
  }

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Danh sách khoa</h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => setOpenFormCreate(true)}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        </Flex>
        <FaculitiesSearch req={facultyReq} triggerFormEvent={triggerFormEvent} />
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
          dataSource={faculties?.data}
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
                setFacultyReq({
                  ...facultyReq,
                  page: 0,
                  size: size,
                });
                setPageSize(size);
              }}
            />
          </Flex>

          <Pagination
            total={faculties?.total || 0}
            current={facultyReq.page || 0 + 1}
            pageSize={facultyReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setFacultyReq({
                ...facultyReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
      <FacultyCreate
        open={openFormCreate}
        onCancel={() => {
          setOpenFormCreate(false);
          getList();
        }}
      />
    </>
  );
};

export default FacultiesList;
