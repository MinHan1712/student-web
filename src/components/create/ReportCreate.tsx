import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Form, InputNumber, Modal, notification, Select } from "antd";
import { useWatch } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import postApi from "../../apis/post.api";
import { formItemLayout1, typeOptions } from "../../constants/general.constant";
import { IClassDTO, IFacultyDTO, IMasterDataDTO, IReportFilter } from "../../interfaces/course";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface IReportCreateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: () => void;
  academicYearM: IMasterDataDTO[];
  listFaculty: IFacultyDTO[];
  classes: IClassDTO[];
}

const ReportCreateModal = ({
  open,
  onCreate,
  onCancel,
  academicYearM,
  listFaculty,
  classes,
}: IReportCreateModalProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IReportFilter>();
  const [loading, setLoading] = useState<boolean>(false);

  const selectedType = useWatch('type', form);
  const selectedAcademicYear = useWatch('academicYear', form);

  const handleSubmit = (values: IReportFilter) => {
    createReport(values);
  };

  const createReport = async (formValues: any) => {
    setLoading(true);
    try {
      await postApi.createReport(formValues).then((response) => {
        notification['success']({
          message: "Thông báo",
          description: 'Tạo báo cáo thành công',
        });
        form.resetFields();
        onCancel();
        onCreate();
      }).catch((err) => {
        const error = err as AxiosError;

        if (error.response?.status === 401) {
          notification.error({
            message: "Lỗi",
            description: "Hết phiên đăng nhập",
          });
          navigate('/login');
          return;
        }

        notification['error']({
          message: "Lỗi",
          description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
        });
      });

    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally {
      setLoading(false);
    }
  };

  // Lọc lớp học theo năm học đã chọn
  const filteredClasses = classes?.filter(cls => cls.academicYear === selectedAcademicYear);

  return (
    <Modal
      open={open}
      title="Tạo báo cáo"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          <CloseCircleOutlined /> Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          <PlusCircleOutlined /> Tạo
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ width: '100%' }}>
        {/* Loại báo cáo */}
        <Form.Item
          {...formItemLayout1}
          labelAlign="left"
          name="type"
          label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Loại báo cáo</span>}
          rules={[{ required: true, message: 'Vui lòng chọn loại báo cáo' }]}
        >
          <Select placeholder="Loại báo cáo">
            {typeOptions?.map((item) => (
              <Select.Option key={item.value} value={item.value} label={item.label}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Khoa */}
        <Form.Item
          {...formItemLayout1}
          labelAlign="left"
          name="facultyId"
          label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Khoa</span>}
          rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
        >
          <Select
            className="d-flex w-100 form-select-search"
            size="middle"
            optionLabelProp="label"
            notFoundContent={listFaculty.length === 0 ? <Empty description="Không có dữ liệu" /> : null}
          >
            {listFaculty?.map((faculty) => (
              <Select.Option key={faculty.id} value={faculty.id} label={faculty.facultyCode}>
                {faculty.facultyCode + " - " + faculty.facultyName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Năm học */}
        {selectedType !== 'Graduation' && (
          <Form.Item
            {...formItemLayout1}
            labelAlign="left"
            name="academicYear"
            label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Năm học</span>}
            rules={[{ required: true, message: 'Vui lòng chọn năm học' }]}
          >
            <Select placeholder="Chọn năm học">
              {academicYearM?.map((item) => (
                <Select.Option key={item.code + "-" + item.id} value={item.code} label={item.name}>
                  {item.code + " - " + item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Tổng tín chỉ tối thiểu */}
        {selectedType !== 'Retake' && (
          <Form.Item
            {...formItemLayout1}
            labelAlign="left"
            name="minTotalCredits"
            label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Tổng tín chỉ tối thiểu</span>}
            rules={[{ required: true, message: "Vui lòng nhập tổng tín chỉ" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        )}

        {/* Lớp học (chỉ khi Retake) */}
        {selectedType === 'Retake' && (
          <Form.Item
            {...formItemLayout1}
            labelAlign="left"
            name="classesId"
            label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Lớp học</span>}
            rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}
          >
            <Select
              placeholder="Chọn lớp học"
              notFoundContent={
                selectedAcademicYear && filteredClasses?.length === 0 ? (
                  <Empty description="Không có lớp học" />
                ) : null
              }
            >
              {filteredClasses?.map((item) => (
                <Select.Option key={item.classCode + "-" + item.id} value={item.id} label={item.classCode + "-" + item.className}>
                  {item.classCode + " - " + item.className}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Ghi chú */}
        <Form.Item
          {...formItemLayout1}
          labelAlign="left"
          name="note"
          label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>}
        >
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReportCreateModal;
