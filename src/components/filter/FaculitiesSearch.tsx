import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import { useEffect } from "react";
import { formItemLayout } from "../../constants/general.constant";
import { ICourseFilter, IFacultyFilter } from "../../interfaces/course";

const { RangePicker } = DatePicker;

interface mapProviderFormSearchToProps {
  req: IFacultyFilter,
  triggerFormEvent: (formValue: any) => void,
}

const FaculitiesSearch = (props: mapProviderFormSearchToProps) => {
  const [form] = Form.useForm<ICourseFilter>();


  useEffect(() => {
    form.setFieldsValue({ ...props.req });
  }, [props.req]);

  const eventSummitForm = (formValue: IFacultyFilter) => {
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
                name={'facultyCode.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã khoa</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã khoa"}
                  name={'facultyCode.contains'}
                  id={'facultyCode.contains'}
                  value={props.req["facultyCode.contains"]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'facultyName.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên khoa</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Tên khoa"}
                  name={'facultyName.contains'}
                  id={'facultyName.contains'}
                  value={props.req["facultyName.contains"]}
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

export default FaculitiesSearch;