package com.flavorfleet.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.io.IOException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CORSFilter implements Filter {
    private final Logger logger = LogManager.getLogger(CORSFilter.class);

    private static final String ALLOWED_ORIGIN = "http://localhost:3000";

    public CORSFilter() {
        logger.info("SimpleCORSFilter init - allowing: " + ALLOWED_ORIGIN);
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        String origin = request.getHeader("Origin");
        
        if (ALLOWED_ORIGIN.equals(origin)) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
            response.setHeader("Access-Control-Max-Age", "3600");
            response.setHeader("Access-Control-Allow-Headers",
                    "Access-Control-Allow-Headers, Authorization, Content-Type, Content-Language, Accept, X-Requested-With, remember-me");
        }

        try {
            if (request.getMethod().equals("OPTIONS"))
                response.setStatus(HttpServletResponse.SC_OK);
            else
                chain.doFilter(req, res);
        } catch (IOException e) {
            logger.error("CORS ERROR : " + e.toString());
            throw e;
        } catch (ServletException se) {
            logger.error("CORS ERROR : " + se.toString());
            throw se;
        }
    }

    @Override
    public void init(FilterConfig filterConfig) {
    }

    @Override
    public void destroy() {
    }

}
