import { Modal, View } from "react-native";

import { createStyles } from "../helpers";

export function CustomModal({ visible, onRequestClose, children }) {
  const styles = useStyles();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  );
}

const useStyles = createStyles(() => ({
  centeredView: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.32)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "#006a65",
    borderRadius: 20,
    padding: 24,
    alignItems: "stretch",
    elevation: 3,
  },
}));
