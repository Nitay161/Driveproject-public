import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  navBar: {
    height: 60,
    backgroundColor: '#343a40', // bg-dark
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  brandText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchForm: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: 500,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 35,
    marginRight: 8,
  },
  searchBtn: {
    borderColor: '#28a745',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#28a745',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeBtn: {
    borderColor: '#f8f9fa',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 15,
  },
  themeBtnText: {
    color: '#f8f9fa',
    fontSize: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    color: 'white',
    marginRight: 10,
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logoutBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});