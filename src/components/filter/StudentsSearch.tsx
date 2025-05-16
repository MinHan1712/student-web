import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { formItemLayout, StudentStatuses } from "../../constants/general.constant";
import { IStudentFilter } from "../../interfaces/course";

const { RangePicker } = DatePicker;

interface mapFormSearchToProps {
  req: IStudentFilter,
  triggerFormEvent: (formValue: any) => void,
}

const StudentsSearch = (props: mapFormSearchToProps) => {
  const [form] = Form.useForm<IStudentFilter>();

  useEffect(() => {
    form.setFieldsValue({ ...props.req });
  }, [props.req]);

  const eventSummitForm = (formValue: IStudentFilter) => {
    props.triggerFormEvent(formValue);
  }

  const providerStyleContent: React.CSSProperties = {
    margin: '8px 0px',
    background: '#fff',
    border: '1px solid #fff',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

  }

  return (
    <>
      <div style={providerStyleContent}>
        <Form form={form} name="course_filter" className="common-form wrapper-form"
          style={{ width: '100%' }}
          onFinish={eventSummitForm}>
          <Flex gap="middle" justify="space-between" align={'center'}
            style={{ width: '100%', padding: '5px' }}>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'studentCode.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã sinh viên</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã sinh viên"}
                  name={'studentCode.contains'}
                  id={'studentCode.contains'}
                  value={props.req["studentCode.contains"]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'phoneNumber.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Số điện thoại</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Số điện thoại"}
                  name={'phoneNumber.contains'}
                  id={'phoneNumber.contains'}
                  value={props.req["phoneNumber.contains"]}
                />
              </Form.Item>
            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'status.equals'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Trạng thái</span>
                }
              >
                <Select
                  defaultValue=""
                  // style={{ width: 120 }}
                  options={StudentStatuses}
                  value={props.req["status.equals"]}
                />
              </Form.Item>

            </div>
          </Flex>
        </Form>
        <Flex gap="middle" justify="flex-end" align={'center'} style={{ width: '100%', paddingBottom: '10px' }}>
          <Button
            className="button btn-add"
            type="primary" onClick={() => {
              form.submit();
            }}>
            <SearchOutlined style={{ verticalAlign: "baseline" }} />
            <span>Tìm kiếm</span>
          </Button>
        </Flex>
      </div>
    </>
  );
};

export default StudentsSearch;