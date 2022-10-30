import { Modal, Text, View } from "react-native";

import { createStyles, CSSStyles } from "../helpers";

interface CustomModalProps {
  visible: boolean;
  onRequestClose: () => void;
  title: string;
  style: CSSStyles;
  children: React.ReactNode;
}

export function CustomModal({
  visible,
  onRequestClose,
  title,
  style,
  children,
}: CustomModalProps) {
  const styles = useStyles();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, style]}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>
          <View style={{ padding: 16 }}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const useStyles = createStyles((theme) => ({
  centeredView: {
    flex: 1,
    padding: theme.padding,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  modalView: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: theme.primaryColor,
    alignItems: "stretch",
    elevation: 3,
  },
  header: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: theme.secondaryColor,
    width: "100%",
  },
  headerText: {
    color: theme.textColor,
    textAlign: "center",
    fontSize: theme.fontSizes.sm,
    fontWeight: "500",
    paddingTop: 8,
    paddingBottom: 8,
  },
}));
