import { StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "50%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 2,
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalHeader: {
    marginBottom: 15,
    backgroundColor: "#fceded",
    padding: 12,
    borderRadius: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: RFPercentage(2.18),
  },
  remainingTimeText: {
    fontSize: RFPercentage(1.92),
    color: "#333",
  },
  motivationText: {
    fontSize: RFPercentage(1.67),
    color: "#666",
  },
  datePickerBox: {
    height: 17,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateLabel: {
    fontSize: RFPercentage(1.67),
    color: "#666",
  },
  dateButton: {
    borderBottomWidth: 1,
    borderColor: "#C7C7CC",
    paddingVertical: 2,
  },
  dateText: {
    fontSize: RFPercentage(1.67),
    color: "#0066cc",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#EFEEF6",
  },
  buttonsBottomBox: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  deleteButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "#d13030",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  editButton: {
    width: "auto",
    height: "auto",
    backgroundColor: "gray",
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 15,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: RFPercentage(2.05),
    marginRight: 8,
  },
  loadingBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    height: "auto",
  },
  deleteButtonSubBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  taskTextHeader: {
    fontWeight: "600",
    marginBottom: 5,
    fontSize: RFPercentage(1.92),
  },
  editButtonsText: {
    fontSize: RFPercentage(2.32),
    fontWeight: "600",
  },
  editableInput: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 6,
    padding: 6,
    minHeight: 38,
  },
  inputStyle: {
    color: "#333",
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderColor: "#C7C7CC",
  },
  taskText: {
    maxHeight: 120,
  },
  editIcon: {
    position: "absolute",
    left: 20,
    top: 2,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
  },
});