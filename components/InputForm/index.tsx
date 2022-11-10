import { Form, Input } from "antd";
import type { SetState, State } from "state";

export function InputForm({
  setState,
  ...state
}: State & {
  setState: SetState;
}) {
  const [form] = Form.useForm<State>();

  function onValuesChange(changes: any, newState: State) {
    console.log("onValuesChange", newState);
    setState(newState);
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
