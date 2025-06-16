import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Empty, Flex, notification, Pagination, Row, Select, Table, Tag } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import getApi from "../apis/get.api";
import getDetailsApi from "../apis/get.details.api";
import { renderText } from "../components/common";
import { selectPageSize, StudentStatuses, typeOptions } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { IStatisticDetailDTO, IStatisticDTO } from "../interfaces/course";
import { AxiosError } from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const StaticDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idClass = params.get("id") || "";

  const [detailStatistics, setDetailStatistics] = useState<IResponseN<IStatisticDetailDTO[]>>();
  const [statistics, setStatistics] = useState<IStatisticDTO>({ id: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));

  const [detailStatisticsReq, setDetailStatisticsReq] = useState({
    page: 0,
    size: 20,
    "statisticsId.equals": idClass,
    "status.equals": true,
    "sort": "lastModifiedDate,desc"
  });

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getStatistics = async () => {
    setLoading(true);
    try {
      const response = await getDetailsApi.getStatistic(idClass);

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

  const getStatisticsDetail = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(detailStatisticsReq);
      const response = await getApi.getStatisticsDetail(fullQuery);

      setDetailStatistics(response);
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
    getStatisticsDetail();
  }, [detailStatisticsReq]);

  useEffect(() => {
    getStatistics()
  }, [])

  const baseColumns = [
    {
      title: "Mã sinh viên",
      dataIndex: ["student", "studentCode"],
      key: "studentCode",
    },
    {
      title: "Họ và tên",
      dataIndex: ["student", "fullName"],
      key: "fullName",
    },
    {
      title: "Lớp",
      dataIndex: ["student", "clasName"],
      key: "clasName",
    },
    {
      title: "Khóa",
      dataIndex: ["student", "courseYear"],
      key: "courseYear",
    },
    {
      title: "Năm học",
      dataIndex: ["statistics", "academicYear"],
      key: "academicYear",
    },
    {
      title: "Trạng thái sinh viên",
      dataIndex: ["student", "status"],
      key: "status",
      render: (value: string) => {
        const statusInfo = StudentStatuses.find((x) => x.value === value);
        return <Tag color={statusInfo?.color}>{statusInfo?.label || value}</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text: string) => text || "-",
    },
  ];

  // Các cột hiển thị khi status === true
  const extraColumns = [
    {
      title: "Tiền học bổng",
      dataIndex: "totalScholarship",
      key: "totalScholarship",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

  const extra1Columns = [
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

  const columns = statistics.type === 'Scholarship'
    ? [...baseColumns.slice(0, 4), ...extraColumns, ...baseColumns.slice(4)]
    : (statistics.type === 'Retake' ? [...baseColumns.slice(0, 4), ...extra1Columns, ...baseColumns.slice(4)] : baseColumns);

  const scholarshipFields = [
    { label: "Mã thống kê", value: statistics?.statisticsCode },
    { label: "Năm học", value: statistics?.academicYear },
    { label: "Loại", value: typeOptions.find(opt => opt.value === statistics?.type)?.label },
    { label: "Ghi chú", value: statistics?.notes }
  ];

  const schilarshipFieldsSecond = [
    { label: "Người tạo", value: statistics?.createdBy },
    { label: "Ngày tạo", value: dayjs(statistics?.createdDate).format("DD/MM/YYYY HH:mm") },
    { label: "Người sửa cuối", value: statistics?.lastModifiedBy },
    { label: "Ngày sửa cuối", value: dayjs(statistics?.lastModifiedDate).format("DD/MM/YYYY HH:mm") }
  ]

  const handleExportExcel = () => {
    if (!detailStatistics?.data) return;

    // ===== Thông tin thống kê header (1 dòng) =====
    const infoHeader = [
      ["Mã thống kê", statistics?.statisticsCode || ""],
      ["Năm học", statistics?.academicYear || ""],
      ["Loại", typeOptions.find(opt => opt.value === statistics?.type)?.label || ""],
      ["Ghi chú", statistics?.notes || ""],
      ["Trạng thái", statistics?.status ? "Hoạt động" : "Không hoạt động"],
      ["Người tạo", statistics?.createdBy || ""],
      ["Ngày tạo", dayjs(statistics?.createdDate).format("DD/MM/YYYY HH:mm")],
      ["Người sửa cuối", statistics?.lastModifiedBy || ""],
      ["Ngày sửa cuối", dayjs(statistics?.lastModifiedDate).format("DD/MM/YYYY HH:mm")]
    ];

    // ===== Dữ liệu sinh viên =====
    const studentData = detailStatistics.data.map((item) => ({
      "Mã sinh viên": item.student?.studentCode || "",
      "Họ và tên": item.student?.fullName || "",
      "Lớp": item.student?.clasName || "",
      "Khóa": item.student?.courseYear || "",
      ...(statistics.type === "Scholarship" && {
        "Tiền học bổng": item.totalScholarship ?? "",
        "Điểm": item.score ?? "",
      }),
      ...(statistics.type === "Retake" && {
        "Điểm": item.score ?? "",
      }),
      "Năm học": item.statistics?.academicYear || "",
      "Trạng thái sinh viên":
        StudentStatuses.find((x) => x.value === item.student?.status)?.label ||
        item.student?.status ||
        "",
      "Ghi chú": item.notes || "",
    }));

    // 3. Tạo sheet và chèn dữ liệu
    const worksheet = XLSX.utils.aoa_to_sheet(infoHeader);

    // Tạo khoảng trống giữa info và danh sách
    const emptyRowIndex = infoHeader.length + 2;

    // Thêm danh sách sinh viên bắt đầu từ hàng tiếp theo
    XLSX.utils.sheet_add_json(worksheet, studentData, {
      origin: `A${emptyRowIndex}`,
      skipHeader: false, // để thêm header cho danh sách sinh viên
    });

    // 4. Tạo workbook và export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Chi tiết thống kê");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `ChiTietThongKe_${statistics.statisticsCode}.xlsx`);
  };


  return (
    <>
      <Breadcrumb style={{ fontSize: '20px', paddingBottom: '10px' }}
        items={[
          {
            title: <Link to={`/statistic`}>Danh sách thống kê</Link>,
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Chi tiết thống kê</span>,
          },
        ]}
      />
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Chi tiết thống kê {statistics.statisticsCode} - <span style={{ color: `${typeOptions.find((x) => x.value == statistics.type)?.color || 'black'}` }}>{typeOptions.find((x) => x.value == statistics.type)?.label || ""}</span></h3>
          <Button
            className="button btn-add d-flex flex-row justify-content-center align-content-center"
            type="primary"
            onClick={() => { handleExportExcel() }}>
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Xuất Excel</span>
          </Button>
        </Flex>
        <Row style={{ margin: "5px", width: "100%", background: "white", padding: "10px", borderRadius: "5px" }}
          className="d-flex ant-row-flex-space-around">
          <Col span={12} style={{ padding: "5px" }}>
            {scholarshipFields.map(({ label, value }) => renderText(label, value || ''))}
          </Col>

          <Col span={12} style={{ padding: "5px" }}>
            <h3 style={{ width: '100%', paddingBottom: '10px' }}></h3>
            <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
              <Col xs={14} sm={14} md={12} lg={10} xl={8}>
                <h5>Trạng thái: </h5>
              </Col>
              <Col xs={14} sm={14} md={12} lg={14} xl={16}>
                <Tag color={statistics?.status ? "green" : "red"}>
                  {statistics?.status ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </Col>
            </Row>
            {schilarshipFieldsSecond.map(({ label, value }) => renderText(label, value || ''))}
          </Col>
        </Row>
      </Flex>
      <div className="table-wrapper" style={{ width: '100%', paddingTop: '10px' }}>
        <Flex>
          <h3 className="title" style={{ width: '100%', paddingBottom: '10px' }}>Danh sách sinh viên</h3>
        </Flex>

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
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                navigate(`/student/details?id=${record?.student?.id}`);
              },
            };
          }}
          columns={columns}
          loading={loading}
          dataSource={detailStatistics?.data}
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
                setDetailStatisticsReq({
                  ...detailStatisticsReq,
                  page: 0,
                  size: size,
                });
                setPageSize(size);
              }}
            />
          </Flex>

          <Pagination
            total={detailStatistics?.total || 0}
            current={detailStatisticsReq.page || 0 + 1}
            pageSize={detailStatisticsReq.size}
            showSizeChanger={false}
            onChange={(page) => {
              setDetailStatisticsReq({
                ...detailStatisticsReq,
                page: page - 1,
              });
            }}
          />
        </Flex>
      </div>
    </>
  );
};

export default StaticDetails;
