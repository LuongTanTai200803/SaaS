package com.saasai.admin;

import com.saasai.admin.*;

import java.util.List;

public interface AdminService {
    AdminDashboardDTO getDashboardOverview();

    List<UserAdminDTO> listUsers(Integer page, Integer size);
    UserAdminDTO getUser(String userId);
    UserAdminDTO updateUser(String userId, UserUpdateRequest req);
    void deleteUser(String userId);

    List<AdminPackageDTO> listPackages();
        // add this line to the interface
    com.saasai.entity.AdminPackageConfig getPackageConfig(String packageType);
    AdminPackageDTO getPackage(String packageType);
    
    AdminPackageDTO upsertPackageConfig(String packageType, AdminPackageUpdateDTO req);

    // finance
    List<InvoiceDTO> listInvoices(int page, int size);
    InvoiceDTO getInvoice(String invoiceId);
    AdminStatsResponseDTO getFinanceStats();
}