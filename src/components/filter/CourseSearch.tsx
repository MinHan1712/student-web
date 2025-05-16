import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input } from "antd";
import { useEffect } from "react";
import { formItemLayout } from "../../constants/general.constant";
import { ICourseFilter } from "../../interfaces/course";

const { RangePicker } = DatePicker;

interface mapProviderFormSearchToProps {
  courseReq: ICourseFilter,
  triggerFormEvent: (formValue: any) => void,
}

const CourseSearch = (props: mapProviderFormSearchToProps) => {
  const [form] = Form.useForm<ICourseFilter>();


  useEffect(() => {
    form.setFieldsValue({ ...props.courseReq });
  }, [props.courseReq]);

  const eventSummitForm = (formValue: ICourseFilter) => {
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
                name={'courseCode.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã môn học</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã môn học"}
                  name={'courseCode.contains'}
                  id={'courseCode.contains'}
                  value={props.courseReq["courseCode.contains"]}
                />
              </Form.Item>

            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'courseTitle.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Tên môn học</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Tên môn học"}
                  name={'courseTitle.contains'}
                  id={'courseTitle.contains'}
                  value={props.courseReq["courseTitle.contains"]}
                />
              </Form.Item>
            </div>
            <div style={{ width: '40%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'semester.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Học kì</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Học kì"}
                  name={'semester.contains'}
                  id={'semester.contains'}
                  value={props.courseReq["semester.contains"]}
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

export default CourseSearch;