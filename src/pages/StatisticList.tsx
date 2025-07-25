import { SearchOutlined } from "@ant-design/icons";
import { Button, Empty, Flex, Form, notification, Pagination, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getApi from "../apis/get.api";
import ReportCreateModal from "../components/create/ReportCreate";
import { formItemLayout, selectPageSize, StatusType, typeOptions } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IClassDTO, IFacultyDTO, IMasterDataDTO, IStatisticDTO, IStatisticFilter } from "../interfaces/course";
import { AxiosError } from "axios";
const StatisticList: React.FC = () => {
  const [form] = Form.useForm<IStatisticFilter>();
  const [statistics, setStatistics] = useState<IResponseN<IStatisticDTO[]>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filterReq, setFilterReq] = useState<IStatisticFilter>({ page: 0, size: 20, "status.equals": true, "sort": "lastModifiedDate,desc" });
  const [academicYearM, setAcademicYear] = useState<IMasterDataDTO[]>([]);
  const navigate = useNavigate();
  const [listFaculty, setListFaculty] = useState<IFacultyDTO[]>([]);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [classes, setClasses] = useState<IClassDTO[]>([]);
  const columns: ColumnsType<IStatisticDTO> = [
    {
      title: "Mã thống kê",
      dataIndex: "statisticsCode",
      key: "statisticsCode",
      render: (_, record) => (
        <Link to={`/statistic/details?id=${record.id}`}>
          {record.statisticsCode}
        </Link>
      ),
    },
    {
      title: "Năm học",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => {
        const item = typeOptions.find(opt => opt.value === value);
        return <Tag color={item?.color}>{item?.label}</Tag>
      }
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
      render: (status: boolean) => {
        const item = StatusType.find(opt => opt.value === status);
        return <Tag color={item?.color}>{item?.label}</Tag>
      }
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render: (text) => text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "",
    },
  ];

  const getListFaculty = async () => {
    try {
      const fullQuery = toQueryString({ page: 0, size: 20, "sort": "lastModifiedDate,desc", "status.equals": true });
      const response = await getApi.getFaculties(fullQuery);

      setListFaculty(response.data || []);
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
    }
  };

  const getListClass = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString({
        page: 0,
        size: 10020,
        "status.equals": true,
        "sort": "lastModifiedDate,desc"
      });
      const response = await getApi.getClasses(fullQuery);

      setClasses(response.data);
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

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return "?" + new URLSearchParams(cleanedParams as any).toString();
  };

  const getList = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(filterReq);
      const response = await getApi.getStatic(fullQuery);

      setStatistics(response);
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

  useEffect(() => {
    getMasterData();
    getListFaculty();
    getListClass();
  }, []);

  useEffect(() => {
    getList();
  }, [filterReq]);

  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    // flexDirection: 'column',
    width: '100%',
  }

  const triggerFormEvent = (value: IStatisticFilter) => {
    setFilterReq({
      ...value,
      page: filterReq.page,
      size: filterReq.size
    });
  }

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Thống kê</h3>
        </Flex>
        <div style={providerStyleContent}>
          <Form form={form} onFinish={triggerFormEvent} name="course_filter" className="common-form wrapper-form"
            style={{ width: '100%' }}>
            <Flex gap="middle" justify="space-between" align={'center'}
              style={{ width: '100%', padding: '5px' }}>
              <div style={{ width: '30%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'type.equals'}
                  label={
                    <span style={{ fontWeight: "550", fontSize: "14px" }}>Khoa</span>
                  }
                >
                  <Select
                    className="d-flex w-100 form-select-search "
                    // style={{ width: '100%' }}
                    size="middle"
                    optionLabelProp="label"
                    loading={loading}
                    onSelect={(selectedId: number) => {
                    }}
                  >
                    {typeOptions?.map((type) => (
                      <Select.Option key={type.value} value={type.value} label={type.label}>
                        {type.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div style={{ width: '30%' }}>
                <Form.Item
                  {...formItemLayout}
                  labelAlign={"left"}
                  name={'academicYear.equals'}
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
                <Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%', paddingBottom: '10px' }}>
                  <Button
                    className="button btn-add"
                    type="primary" onClick={() => {
                      form.submit();
                    }}>
                    <SearchOutlined style={{ verticalAlign: "baseline" }} />
                    <span>Tìm kiếm</span>
                  </Button>
                  <Button
                    className="button btn-add"
                    type="primary"
                    onClick={() => {
                      setOpenReportModal(true); // Mở modal
                    }}
                  >
                    <SearchOutlined style={{ verticalAlign: "baseline" }} />
                    <span>Tạo báo cáo</span>
                  </Button>
                </Flex>

              </div></Flex>
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
          columns={columns}
          loading={loading}
          dataSource={statistics?.data}
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
                setFilterReq({
                  ...filterReq,
                  page: 0,
                  size: size,
                });
                setPageSize(size);
              }}
            />
          </Flex>

          <Pagination
            total={statistics?.total || 0}
            current={filterReq.page || 0 + 1}
            pageSize={filterReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setFilterReq({
                ...filterReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>

      <ReportCreateModal
        open={openReportModal}
        academicYearM={academicYearM}
        listFaculty={listFaculty}
        onCancel={() => setOpenReportModal(false)}
        classes={classes}
        onCreate={() => {
          try {
            getList();
          } catch (error) {
            console.error("Error creating report:", error);
          } finally {
            setOpenReportModal(false);
          }
        }}
      />
    </>
  );
};

export default StatisticList;