import { Form, Input } from "antd";
import type { Dispatch, SetStateAction } from "react";

export function InputForm({
  text,
  toNumber,
}: {
  text: string;
  toNumber: string;
  setState: Dispatch<
    SetStateAction<{
      text: string;
      toNumber: string;
    }>
  >;
}) {
  const [form] = Form.useForm();

  function onValuesChange(it: any) {
    console.log("handleChange", it);
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      layout="vertical"
      wrapperCol={{ span: 14 }}
      onValuesChange={onValuesChange}
    >
      <Form.Item label="Phone number" name="toNumber">
        <Input />
      </Form.Item>
    </Form>
  );
}
