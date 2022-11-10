import { Button, Form, Input, Radio } from "antd";
import type { Dispatch, SetStateAction } from "react";

export function InputForm({
  fromNumber,
  toNumber,
  text,
}: {
  fromNumber: string;
  text: string;
  toNumber: string;
  setFromNumber: Dispatch<SetStateAction<string>>;
  setText: Dispatch<SetStateAction<string>>;
  setToNumber: Dispatch<SetStateAction<string>>;
}) {
  const [form] = Form.useForm();

  function onValuesChange(it: any) {
    console.log("handleChange", it);
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      layout="horizontal"
      wrapperCol={{ span: 14 }}
      onValuesChange={onValuesChange}
    >
      <Form.Item label="Phone number" name="layout">
        <Input />
      </Form.Item>
    </Form>
  );
}
