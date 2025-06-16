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
  notification
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import postApi from "../../apis/post.api";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IFacultyDTO } from "../../interfaces/course";
import { handleError } from "../../constants/general.constant";

interface IFacultyCreateProps {
  open: boolean;
  onCancel: () => void;
}

const FacultyCreate = ({ open, onCancel }: IFacultyCreateProps) => {
  const [form] = Form.useForm<IFacultyDTO>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  const handleSubmit = async (value: IFacultyDTO) => {
    setLoading(true);
    try {
      const payload: IFacultyDTO = {
        ...value,
        establishedDate: value.establishedDate ? dayjs(value.establishedDate).toDate().toISOString() : undefined,
        status: true
      };

      await postApi.createFaculties(payload);
      notification.success({
        message: "Thông báo",
        description: "Thêm khoa thành công",
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
      title="Tạo mới Khoa"
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
          name="facultyName"
          label="Tên khoa"
          rules={[{ required: true, message: "Vui lòng nhập tên khoa" }]}
        >
          <Input placeholder="Nhập tên khoa" />
        </Form.Item>

        <Form.Item name="establishedDate" label="Ngày thành lập">
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày thành lập"
          />
        </Form.Item>

        <Form.Item name="phoneNumber" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item name="location" label="Địa điểm">
          <Input placeholder="Nhập địa điểm" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item name="notes" label="Ghi chú">
          <Input.TextArea placeholder="Nhập ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FacultyCreate;
