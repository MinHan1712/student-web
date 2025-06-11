import { Empty, Flex, Pagination, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import FaculitiesSearch from "../components/filter/FaculitiesSearch";
import { selectPageSize } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IFacultyDTO, IFacultyFilter } from "../interfaces/course";

const FacultiesList: React.FC = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState<IResponseN<IFacultyDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [facultyReq, setFacultyReq] = useState<IFacultyFilter>({
    page: 0,
    size: 20
  });

  const columns: ColumnsType<IFacultyDTO> = [
    {
      title: "Mã khoa",
      dataIndex: "facultyCode",
      key: "facultyCode",
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
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
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
      const fullQuery = toQueryString(facultyReq);
      const response = await getApi.getFaculties(fullQuery);
      setFaculties(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
          onRow={(record) => {
            return {
              onClick: () => {
                navigate(`/faculties/details?id=${record.id}`);
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
    </>
  );
};

export default FacultiesList;
