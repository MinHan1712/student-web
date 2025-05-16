import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, Select } from "antd";
import { useEffect } from "react";
import { formItemLayout, StatusType } from "../../constants/general.constant";
import { IClassFilter } from "../../interfaces/course";

const { RangePicker } = DatePicker;

interface mapFormSearchToProps {
  req: IClassFilter,
  triggerFormEvent: (formValue: any) => void,
  // handleDateChangeEnd: (date: Dayjs | null, dateString: string | string[]) => void,
  // handleDateChangeStart: (date: Dayjs | null, dateString: string | string[]) => void
}

const ClassesSearch = (props: mapFormSearchToProps) => {
  const [form] = Form.useForm<IClassFilter>();

  useEffect(() => {
    form.setFieldsValue({ ...props.req });
  }, [props.req]);

  const eventSummitForm = (formValue: IClassFilter) => {
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
            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'classCode.contains'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Mã lớp</span>
                }
              >
                <Input
                  className="form-input d-flex"
                  size="middle"
                  placeholder={"Mã lớp"}
                  name={'classCode.contains'}
                  id={'classCode.contains'}
                  value={props.req["classCode.contains"]}
                />
              </Form.Item>

            </div>
           
            {/* <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'startDate.greaterThanOrEqual'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày bắt đầu</span>
                }
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  name="startDate.greaterThanOrEqual"
                  className="form-input d-flex"
                  size="middle"
                  placeholder="Ngày bắt đầu"
                  value={
                    props.req["startDate.greaterThanOrEqual"]
                      ? dayjs(props.req["startDate.greaterThanOrEqual"])
                      : null
                  }
                  onChange={props.handleDateChangeStart}
                />
              
              </Form.Item>
            </div>

            <div style={{ width: '30%' }}>
              <Form.Item
                {...formItemLayout}
                labelAlign={"left"}
                name={'endDate.lessThanOrEqual'}
                label={
                  <span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày kết thúc</span>
                }
              >
                <DatePicker
                  format="DD-MM-YYYY"
                  name="endDate.lessThanOrEqual"
                  className="form-input d-flex"
                  size="middle"
                  placeholder="Ngày kết thúc"
                  value={
                    props.req["endDate.lessThanOrEqual"]
                      ? dayjs(props.req["endDate.lessThanOrEqual"]) : null
                  }
                  onChange={props.handleDateChangeEnd}
                />
              
              </Form.Item>
            </div> */}

            <div style={{ width: '30%' }}>
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
                  options={StatusType}
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

export default ClassesSearch;