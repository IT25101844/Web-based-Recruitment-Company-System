package com.jobconnect.scheduler;

import com.jobconnect.service.JobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class JobExpirationScheduler {

    private static final Logger log = LoggerFactory.getLogger(JobExpirationScheduler.class);

    private final JobService jobService;

    public JobExpirationScheduler(JobService jobService) {
        this.jobService = jobService;
    }

    // Runs every 5 minutes
    @Scheduled(fixedRate = 300000)
    public void checkForExpiredJobs() {
        try {
            int expiredCount = jobService.expireOverdueJobs();
            if (expiredCount > 0) {
                log.info("Scheduler expired {} jobs that passed their deadline.", expiredCount);
            }
        } catch (Exception ex) {
            log.error("Error during scheduled job expiration check", ex);
        }
    }
}
