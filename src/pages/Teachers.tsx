import { Flex, Pagination, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import TeachesSearch from "../components/filter/TeachesSearch";
import { PositionTeaches, QualificationTeaches, selectPageSize, StatusType } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { ITeacherDTO, ITeacherFilter } from "../interfaces/course";

const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<IResponseN<ITeacherDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isReload, setIsReload] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [teachersReq, setTeachersReq] = useState<ITeacherFilter>({
    page: 0,
    size: 20
  });
  const columns: ColumnsType<ITeacherDTO> = [
    {
      title: "Mã giảng viên",
      dataIndex: "teachersCode",
      key: "teachersCode",
    },
    {
      title: "Tên giảng viên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {PositionTeaches.find((x) => x.value == text)?.label}
        </div>
      )
    },
    {
      title: "Trình độ",
      dataIndex: "qualification",
      key: "qualification",
      render: (text) => (
        <div className="style-text-limit-number-line2">
          {QualificationTeaches.find((x) => x.value == text)?.label}
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
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "-",
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
      const fullQuery = toQueryString(teachersReq);
      const response = await getApi.getTeachers(fullQuery);
      setTeachers(response);

    } catch (err) {
      console.log(err);
    } finally { setLoading(false); }
  }

  const triggerFormEvent = (value: ITeacherFilter) => {
    setTeachersReq({
      ...value,
      page: teachersReq.page,
      size: teachersReq.size
    });
  }

  useEffect(() => {
    setIsReload(false);
    getList();
  }, [teachersReq, isReload])


  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Danh sách giảng viên</h3>
        </Flex>
        <TeachesSearch req={teachersReq} triggerFormEvent={triggerFormEvent} />
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
          columns={columns}
          loading={loading}
          dataSource={teachers?.data}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/teaches/details?id=${record.id}`);
              },
            };
          }}
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
                setTeachersReq({
                  ...teachersReq,
                  page: 0,
                  size: size
                });
                setPageSize(size);
              }} />
            {/* <h5> Tổng số {CourseRes || 0}  nhà cung cấp</h5> */}
          </Flex>


          <Pagination
            total={teachers?.total || 0}
            current={teachersReq.page || 0 + 1}
            pageSize={teachersReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setTeachersReq({
                ...teachersReq,
                page: page - 1,
              });
            }} />
        </Flex>

      </div>
    </>
  );
};

export default Teachers;
