import { Form, Input } from "antd";
import type { SetState, State } from "state";

const { TextArea } = Input;

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
      initialValues={state}
      labelCol={{ span: 4 }}
      layout="vertical"
      onValuesChange={onValuesChange}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item label="Phone number" name="toNumber">
        <Input />
      </Form.Item>
      <Form.Item label="Message" name="text">
        <TextArea />
      </Form.Item>
    </Form>
  );
}
