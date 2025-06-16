import { Form, Input, Select, Button, Col, Row, Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import { ICourseDTO } from '../../interfaces/course';
import { courseTypeOptions, handleError } from '../../constants/general.constant';
import postApi from '../../apis/post.api';
import { useNavigate } from 'react-router-dom';

interface Props {
  getList: () => void;
  onCancel: () => void;
  open: boolean;
}

export default function CourseCreate({ getList, onCancel, open }: Props) {
  const [form] = Form.useForm();
  const [semesters, setSemesters] = useState<string[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setSemesters(['HK1', 'HK2', 'HK3', 'HK4', 'HK5', 'HK6', 'HK7', 'HK8']);
  }, []);

  const handleFinish = async (value: ICourseDTO) => {
    try {
      const payload = {
        ...value,
        status: true
      }
      await postApi.createCourses(payload);
      notification.success({
        message: "Thông báo",
        description: "Thêm học phần thành công",
      });
      onCancel();
      getList();
      form.resetFields();
    } catch (err: any) {
      handleError(err, navigate);
    } finally {
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo khóa học mới"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width="60%"
      footer={[
        <Button key="cancel" onClick={() => {
          form.resetFields();
          onCancel();
        }}>
          Hủy bỏ
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Tạo mới
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên khóa học"
              name="courseTitle"
              rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
            >
              <Input placeholder="Nhập tên khóa học" />
            </Form.Item>

            <Form.Item
              label="Số tín chỉ"
              name="credits"
              rules={[
                { required: true, message: 'Vui lòng nhập số tín chỉ' }
              ]}
            >
              <Input type="number" placeholder="Nhập số tín chỉ" />
            </Form.Item>

            <Form.Item
              label="Giảng dạy lý thuyết"
              name="lecture"
              rules={[{ required: true, message: 'Vui lòng nhập giờ giảng dạy lý thuyết' }]}
            >
              <Input placeholder="Nhập giờ giảng dạy lý thuyết" />
            </Form.Item>

            <Form.Item
              label="Thảo luận/Bài tập"
              name="tutorialDiscussion"
              rules={[{ required: true, message: 'Vui lòng nhập giờ thảo luận/bài tập' }]}
            >
              <Input placeholder="Nhập giờ thảo luận/bài tập" />
            </Form.Item>

            <Form.Item
              label="Thực hành"
              name="practical"
              rules={[{ required: true, message: 'Vui lòng nhập giờ thực hành' }]}
            >
              <Input placeholder="Nhập giờ thực hành" />
            </Form.Item>

            <Form.Item
              label="Thí nghiệm"
              name="laboratory"
              rules={[{ required: true, message: 'Vui lòng nhập giờ thí nghiệm' }]}
            >
              <Input placeholder="Nhập giờ thí nghiệm" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tự học"
              name="selfStudy"
              rules={[{ required: true, message: 'Vui lòng nhập giờ tự học' }]}
            >
              <Input placeholder="Nhập giờ tự học" />
            </Form.Item>

            <Form.Item
              label="Số buổi học"
              name="numberOfSessions"
              rules={[{ required: true, message: 'Vui lòng nhập số buổi học' }]}
            >
              <Input placeholder="Nhập số buổi học" />
            </Form.Item>

            <Form.Item
              label="Loại khóa học"
              name="courseType"
              rules={[{ required: true, message: 'Vui lòng chọn loại khóa học' }]}
            >
              <Select>
                {courseTypeOptions.map(type => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Học kỳ"
              name="semester"
              rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}
            >
              <Select>
                {semesters.map(sem => (
                  <Select.Option key={sem} value={sem}>
                    {sem}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Ghi chú"
              name="notes"
            >
              <Input.TextArea rows={4} placeholder="Nhập ghi chú" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}