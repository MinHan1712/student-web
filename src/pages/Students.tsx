import { Empty, Flex, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import getApi from "../apis/get.api";
import StudentsSearch from "../components/filter/StudentsSearch";
import { genderMap, selectPageSize, StudentStatuses } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IStudentDTO, IStudentFilter } from "../interfaces/course";


const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<IResponseN<IStudentDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isReload, setIsReload] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [studentReq, setStudentReq] = useState<IStudentFilter>({
    page: 0,
    size: 20
  });

  const columns: ColumnsType<IStudentDTO> = [
    {
      title: "Mã sinh viên",
      dataIndex: "studentCode",
      key: "studentCode",
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
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
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
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
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
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsReload(false);
    getList();
  }, [studentReq]);

  const triggerFormEvent = (value: IStudentFilter) => {
    setStudentReq({
      ...value,
      page: studentReq.page,
      size: studentReq.size
    });
  }

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Danh sách sinh viên</h3>
        </Flex>
        <StudentsSearch req={studentReq} triggerFormEvent={triggerFormEvent} />
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
                  page: 1,
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
    </>
  );
};

export default StudentsList;
