import { Empty, Flex, Pagination, Select, Tag } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import getApi from "../apis/get.api";
import '../assets/css/style.css';
import CourseSearch from "../components/filter/CourseSearch";
import { selectPageSize } from "../constants/general.constant";
import { IResponseN } from "../interfaces/common";
import { ICourseDTO, ICourseFilter } from "../interfaces/course";

const Course: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(Number(selectPageSize[0].value));
  const [isReload, setIsReload] = useState(false);

  const [courseRes, setCourseRes] = useState<IResponseN<ICourseDTO[]>>();

  const [courseReq, setCourseReq] = useState<ICourseFilter>({
    page: 0,
    size: 20
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
      console.log(err);
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
      render: (text) => (
        <div className="style-text-limit-number-line2">
          <span>{text}</span>
        </div>
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
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "8%",
      align: "center",
      render: (text) => {
        return (
          <Tag>
            {text === "true" ? "Hoạt động" : "Xóa"}
          </Tag>
        );
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
  ];

  let locale = {
    emptyText: (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Trống" />
    )
  };

  useEffect(() => {
    setIsReload(false);
    getListCourse();
    console.log('request', courseReq);
  }, [courseReq, isReload])

  return (
    <>
      <Flex gap="middle" vertical justify="space-between" align={'center'} style={{ width: '100%' }} >
        <Flex gap="middle" justify="flex-start" align={'center'} style={{ width: '100%' }}>
          <h3 className="title">Môn học</h3>
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
                  page: 1,
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
    </>
  );
};

export default Course;