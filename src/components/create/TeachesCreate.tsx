import {
  CloseCircleOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Switch
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import postApi from "../../apis/post.api";
import { useNavigate } from "react-router-dom";
import { handleError, PositionTeaches, QualificationTeaches } from "../../constants/general.constant";
import { IFacultyDTO, ITeacherDTO } from "../../interfaces/course";
import getApi from "../../apis/get.api";

interface ITeacherCreateProps {
  open: boolean;
  onCancel: () => void;
}

const TeacherCreate = ({ open, onCancel }: ITeacherCreateProps) => {
  const [form] = Form.useForm<ITeacherDTO>();
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<IFacultyDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchFaculties();
    } else {
      form.resetFields();
    }
  }, [open]);

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const fetchFaculties = async () => {
    try {
      const fullQuery = toQueryString({ page: 0, size: 10000, "status.equals": true });
      const response = await getApi.getFaculties(fullQuery);
      setFaculties(response.data || []);
    } catch (err) {
      handleError(err, navigate);
    }
  };

  const handleSubmit = async (value: ITeacherDTO) => {
    setLoading(true);
    try {
      const payload: ITeacherDTO = {
        ...value,
        startDate: value.startDate ? dayjs(value.startDate).toDate().toISOString() : undefined,
        endDate: value.endDate ? dayjs(value.endDate).toDate().toISOString() : undefined,
        status: true,
      };

      await postApi.createTeachers(payload);
      notification.success({
        message: "Thông báo",
        description: "Thêm giảng viên thành công",
      });
      form.resetFields();
      onCancel();
    } catch (err) {
      handleError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo mới Giảng viên"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width="50%"
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
          type="primary"
          className="button btn-cancel"
        >
          <CloseCircleOutlined />
          Đóng
        </Button>,
        <Button
          key="submit"
          loading={loading}
          type="primary"
          onClick={() => form.submit()}
          className="button btn-add"
        >
          <PlusCircleOutlined />
          Thêm mới
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ padding: "0 10px" }}
      >
        <Form.Item
          name="name"
          label="Tên giảng viên"
          rules={[{ required: true, message: "Vui lòng nhập tên giảng viên" }]}
        >
          <Input placeholder="Nhập tên giảng viên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ type: "email", message: "Email không hợp lệ" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="position" label="Chức vụ">
          <Select
            style={{ width: '100%' }}
            options={PositionTeaches.map(x => ({ value: x.value, label: x.label }))}
          />
        </Form.Item>

        <Form.Item name="qualification" label="Trình độ">
          <Select
            style={{ width: '100%' }}
            options={QualificationTeaches.map(x => ({ value: x.value, label: x.label }))}
          />
        </Form.Item>

        <Form.Item name="startDate" label="Ngày bắt đầu">
          <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày bắt đầu" />
        </Form.Item>

        <Form.Item name="endDate" label="Ngày kết thúc">
          <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày kết thúc" />
        </Form.Item>

        <Form.Item name={['faculties', 'id']} label="Khoa" rules={[{ required: true, message: "Vui lòng chọn khoa" }]}>
          <Select
            placeholder="Chọn khoa"
            allowClear
            options={faculties.map(faculty => ({
              label: faculty.facultyName,
              value: faculty.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default TeacherCreate;
