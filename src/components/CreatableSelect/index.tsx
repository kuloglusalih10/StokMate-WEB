import { Select, Button, type SelectProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { BRAND_COLORS } from "../../constants/colors";

type CreatableOption = {
  label: string;
  value: number;
};

type CreatableSelectProps = {
  value?: number;
  onChange?: (value: number) => void;
  options: CreatableOption[];
  loading?: boolean;
  placeholder?: string;
  addButtonText?: string;
  size?: SelectProps["size"];
  onAddClick: () => void;
};

const CreatableSelect = ({
  value,
  onChange,
  options,
  loading,
  placeholder,
  addButtonText = "Yeni ekle",
  size = "large",
  onAddClick,
}: CreatableSelectProps) => (
  <Select
    value={value}
    onChange={onChange}
    options={options}
    loading={loading}
    placeholder={placeholder}
    size={size}
    showSearch
    optionFilterProp="label"
    style={{ width: "100%" }}
    popupRender={(menu) => (
      <>
        {menu}
        <div style={{ borderTop: "1px solid #F0F0F0", padding: 6 }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            block
            onClick={onAddClick}
            style={{ textAlign: "left", color: BRAND_COLORS.secondary, fontWeight: 600 }}
          >
            {addButtonText}
          </Button>
        </div>
      </>
    )}
  />
);

export default CreatableSelect;
