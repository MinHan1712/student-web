import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { formItemLayout, PositionTeaches, QualificationTeaches } from "../../constants/general.constant";
import { ITeacherFilter } from "../../interfaces/course";

const { RangePicker } = DatePicker;

interface mapProviderFormSearchToProps {
  req: ITeacherFilter,
  triggerFormEvent: (formValue: any) => void,
}

const TeachesSearch = (props: mapProviderFormSearchToProps) => {
  const [form] = Form.useForm<ITeacherFilter>();


  useEffect(() => {
    form.setFieldsValue({ ...props.req });
  }, [props.req]);

  const eventSummitForm = (formValue: ITeacherFilter) => {
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
                name={'teacherCode.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã giáo viên</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã giáo viên"}
                  name={'teacherCode.contains'}
                  id={'teacherCode.contains'}
                  value={props.req["teacherCode.contains"]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'name.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên giáo viên</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Tên giáo viên"}
                  name={'name.contains'}
                  id={'name.contains'}
                  value={props.req["name.contains"]}
                />
              </Form.Item>
            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'position.equals'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Vị trí</span>
                }
              >
                <Select
                  defaultValue=""
                  // style={{ width: 120 }}
                  options={PositionTeaches}
                  value={props.req["position.equals"]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'qualification.equals'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Trình độ</span>
                }
              >
                <Select
                  defaultValue=""
                  // style={{ width: 120 }}
                  options={QualificationTeaches}
                  value={props.req["qualification.equals"]}
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

export default TeachesSearch;