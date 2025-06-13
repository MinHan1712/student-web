import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Empty, Form, InputNumber, Modal, notification, Select } from "antd";
import { useWatch } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import postApi from "../../apis/post.api";
import { formItemLayout1, typeOptions } from "../../constants/general.constant";
import { IFacultyDTO, IMasterDataDTO, IReportFilter } from "../../interfaces/course";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";


interface IReportCreateModalProps {
  open: boolean;
  onCancel: () => void;
  onCreate: () => void;
  academicYearM: IMasterDataDTO[];
  listFaculty: IFacultyDTO[];
}

const ReportCreateModal = ({ open, onCreate, onCancel, academicYearM, listFaculty }: IReportCreateModalProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm<IReportFilter>();
  const [loading, setLoading] = useState<boolean>(false);
  const selectedType = useWatch('type', form);
  const handleSubmit = (values: IReportFilter) => {
    createReport(values);
  };

  const createReport = async (formValues: any) => {
    setLoading(true);
    try {
      await postApi.createReport(formValues).then((response) => {
        // switch (response) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Tạo báo cáo thành công',
        });
        form.resetFields();
        onCancel();
        onCreate();
      })
        .catch((err) => {
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
          notification['error']({
            message: "Lỗi",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
        })

    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally { setLoading(false); }
  };

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
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          <PlusCircleOutlined /> Tạo
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ width: '100%' }}>
        <div style={{ width: '100%' }}>
          <Form.Item
            {...formItemLayout1}
            labelAlign={"left"}
            name={'type'}
            label={
              <span style={{ fontWeight: "550", fontSize: "14px" }}>Loại báo cáo</span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn loại báo cáo' }]}
          >
            <Select
              placeholder="Loại báo cáo"
              disabled={!typeOptions}
              notFoundContent={
                typeOptions && typeOptions.length === 0 ? (
                  <Empty description="Không có năm học" />
                ) : null
              }
            >
              {typeOptions?.map((item) => (
                <Select.Option key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </div>


        <div style={{ width: '100%' }}>
          <Form.Item
            {...formItemLayout1}
            labelAlign={"left"}
            name={'facultyId'}
            label={
              <span style={{ fontWeight: "550", fontSize: "14px" }}>Khoa</span>
            }
            rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
          >
            <Select
              className="d-flex w-100 form-select-search "
              size="middle"
              optionLabelProp="label"
              notFoundContent={listFaculty ? <Empty description="Không có dữ liệu" /> : null}
            >
              {listFaculty?.map((faculty) => (
                <Select.Option key={faculty.id} value={faculty.id} label={faculty.facultyCode}>
                  {faculty.facultyCode + "-" + faculty.facultyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </div>

        {selectedType !== 'Graduation' && (
          <div style={{ width: '100%' }}>
            <Form.Item
              {...formItemLayout1}
              labelAlign={"left"}
              name={'academicYear'}
              label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Năm học</span>}
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
        )}
        <div style={{ width: '100%' }}>
          <Form.Item
            {...formItemLayout1}
            labelAlign={"left"}
            name="minTotalCredits"
            rules={[{ required: true, message: "Vui lòng nhập tổng tín chỉ" }]}
            label={
              <span style={{ fontWeight: "550", fontSize: "14px" }}>Tổng tín chỉ tối thiểu</span>
            }
          >
            <InputNumber style={{ width: "100%" }} min={0} />

          </Form.Item>
        </div>

        <div style={{ width: '100%' }}>
          <Form.Item
            {...formItemLayout1}
            labelAlign={"left"}
            name="note"
            label={
              <span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>
            }
          >
            <TextArea />

          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ReportCreateModal;
