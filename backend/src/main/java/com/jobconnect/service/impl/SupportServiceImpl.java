package com.jobconnect.service.impl;

import com.jobconnect.dto.support.ComplaintCreateDto;
import com.jobconnect.dto.support.ComplaintResponseDto;
import com.jobconnect.dto.support.ComplaintStatusUpdateDto;
import com.jobconnect.entity.Complaint;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.exception.UnauthorizedException;
import com.jobconnect.repository.ComplaintRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.UserPrincipal;
import com.jobconnect.service.NotificationService;
import com.jobconnect.service.SupportService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Year;
import java.util.Random;

@Service
@Transactional
public class SupportServiceImpl implements SupportService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SupportServiceImpl(
            ComplaintRepository complaintRepository,
            UserRepository userRepository,
            NotificationService notificationService) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }
        return (UserPrincipal) auth.getPrincipal();
    }

    @Override
    public ComplaintResponseDto createTicket(ComplaintCreateDto dto) {
        UserPrincipal user = getCurrentUser();
        User reporter = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", user.getId()));

        String ticketId = "TKT-" + Year.now().getValue() + "-" + String.format("%04d", new Random().nextInt(10000));
        while (complaintRepository.existsByTicketId(ticketId)) {
            ticketId = "TKT-" + Year.now().getValue() + "-" + String.format("%04d", new Random().nextInt(10000));
        }

        Complaint complaint = new Complaint();
        complaint.setTicketId(ticketId);
        complaint.setReporter(reporter);
        complaint.setSubject(dto.getSubject());
        complaint.setDescription(dto.getDescription());

        if (dto.getIssueType() != null) {
            String it = dto.getIssueType().toUpperCase();
            if (it.contains("TECH")) {
                complaint.setIssueType(Complaint.IssueType.TECHNICAL_ISSUE);
            } else if (it.contains("SPAM")) {
                complaint.setIssueType(Complaint.IssueType.SPAM_REPORT);
            } else if (it.contains("COMPLAINT") || it.contains("GRIEVANCE") || it.contains("DISPUTE")) {
                complaint.setIssueType(Complaint.IssueType.COMPLAINT);
            } else {
                try {
                    complaint.setIssueType(Complaint.IssueType.valueOf(it));
                } catch (Exception ex) {
                    complaint.setIssueType(Complaint.IssueType.OTHER);
                }
            }
        }
        if (dto.getPriority() != null) {
            try {
                complaint.setPriority(Complaint.Priority.valueOf(dto.getPriority().toUpperCase()));
            } catch (Exception ignored) {}
        }
        complaint.setStatus(Complaint.TicketStatus.OPEN);

        Complaint saved = complaintRepository.save(complaint);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponseDto> getMyTickets(Pageable pageable) {
        UserPrincipal user = getCurrentUser();
        return complaintRepository.findByReporterIdOrderByCreatedAtDesc(user.getId(), pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintResponseDto> getAllTickets(String status, String priority, Pageable pageable) {
        if (StringUtils.hasText(status)) {
            try {
                Complaint.TicketStatus ts = Complaint.TicketStatus.valueOf(status.toUpperCase());
                return complaintRepository.findByStatus(ts, pageable).map(this::mapToDto);
            } catch (Exception ignored) {}
        }
        if (StringUtils.hasText(priority)) {
            try {
                Complaint.Priority pr = Complaint.Priority.valueOf(priority.toUpperCase());
                return complaintRepository.findByPriority(pr, pageable).map(this::mapToDto);
            } catch (Exception ignored) {}
        }
        return complaintRepository.findAll(pageable).map(this::mapToDto);
    }

    private Complaint findComplaint(String ticketId) {
        return complaintRepository.findByTicketId(ticketId)
                .or(() -> {
                    try {
                        Long id = Long.parseLong(ticketId);
                        return complaintRepository.findById(id);
                    } catch (NumberFormatException ignored) {
                        return java.util.Optional.empty();
                    }
                })
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "ticketId", ticketId));
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponseDto getTicketDetails(String ticketId) {
        Complaint complaint = findComplaint(ticketId);

        UserPrincipal user = getCurrentUser();
        boolean isStaff = user.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_ADMIN") ||
                a.getAuthority().equals("ROLE_SUPER_ADMIN") ||
                a.getAuthority().equals("ROLE_CUSTOMER_SUPPORT") ||
                a.getAuthority().equals("ROLE_SUPPORT"));

        if (!isStaff && !complaint.getReporter().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to view this ticket");
        }

        return mapToDto(complaint);
    }

    @Override
    public ComplaintResponseDto updateTicket(String ticketId, ComplaintStatusUpdateDto dto) {
        Complaint complaint = findComplaint(ticketId);

        if (StringUtils.hasText(dto.getStatus())) {
            String s = dto.getStatus().toUpperCase();
            if (s.equals("UNDER_INVESTIGATION")) {
                complaint.setStatus(Complaint.TicketStatus.IN_PROGRESS);
            } else if (s.equals("CLOSED") || s.equals("DISMISSED")) {
                complaint.setStatus(Complaint.TicketStatus.RESOLVED);
            } else {
                try {
                    complaint.setStatus(Complaint.TicketStatus.valueOf(s));
                } catch (Exception ex) {
                    throw new BadRequestException("Invalid status: " + dto.getStatus());
                }
            }
        }

        if (StringUtils.hasText(dto.getPriority())) {
            try {
                Complaint.Priority newPriority = Complaint.Priority.valueOf(dto.getPriority().toUpperCase());
                complaint.setPriority(newPriority);
            } catch (Exception ignored) {}
        }

        if (dto.getAssignedToId() != null) {
            User assignedStaff = userRepository.findById(dto.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Staff", "id", dto.getAssignedToId()));
            complaint.setAssignedTo(assignedStaff);
        }

        if (dto.getResolutionNote() != null) {
            complaint.setResolutionNote(dto.getResolutionNote());
        }

        Complaint saved = complaintRepository.save(complaint);

        // Notify user about ticket status change
        notificationService.createNotification(
                complaint.getReporter().getId(),
                "TICKET_UPDATE",
                "Support Ticket Updated: " + complaint.getTicketId(),
                "Your ticket status is now: " + complaint.getStatus().name() +
                        (dto.getResolutionNote() != null ? ". Note: " + dto.getResolutionNote() : ""),
                complaint.getId()
        );

        return mapToDto(saved);
    }

    private ComplaintResponseDto mapToDto(Complaint c) {
        ComplaintResponseDto dto = new ComplaintResponseDto();
        dto.setId(c.getId());
        dto.setTicketId(c.getTicketId());
        dto.setReporterId(c.getReporter().getId());
        dto.setReporterName(c.getReporter().getFullName());
        dto.setReporterEmail(c.getReporter().getEmail());
        dto.setIssueType(c.getIssueType().name());
        dto.setSubject(c.getSubject());
        dto.setDescription(c.getDescription());
        dto.setPriority(c.getPriority().name());
        dto.setStatus(c.getStatus().name());

        if (c.getAssignedTo() != null) {
            dto.setAssignedToId(c.getAssignedTo().getId());
            dto.setAssignedToName(c.getAssignedTo().getFullName());
        }

        dto.setResolutionNote(c.getResolutionNote());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }
}
