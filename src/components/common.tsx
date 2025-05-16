import { Col, Row } from "antd";
import { formItemLayout } from "../constants/general.constant";

export const renderText = (label: string, text: string, formItemLayou: any = formItemLayout, textAlign: any = "end") => {
  return (
    <Row className="d-flex align-items-center mb-1" style={{ width: '100%', paddingBottom: '10px' }}>
      <Col xs={14} sm={14} md={12} lg={10} xl={8}>
        <h5>{label}: </h5>
      </Col>
      <Col xs={14} sm={14} md={12} lg={14} xl={16}>
        <div>{text}</div>
      </Col>
    </Row>
  );
}