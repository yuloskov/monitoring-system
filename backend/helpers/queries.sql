select id, action_attributes_str, action_attributes_num, action_result, request_ip, server_time into buffering_stop from users where action_id='buffer_stop';

select id, action_attributes_str, request_ip, server_time into buffering_stop from users where action_id='buffer_stop';

select a.action_attributes_str as buff_time, b.longitude, b.latitude into buff_stop_metric_14 from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= '2021-03-14 18:00:00' and server_time < '2021-03-14 20:00:00';
select a.action_attributes_str as buff_time, b.longitude, b.latitude from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= '2021-03-14 18:00:00' and server_time < '2021-03-14 20:00:00';

select action_result as quality, count(*) as count from qualities where profile_id = '5973fcd6dad286804cb153da467fddb6' and server_time >= '2021-03-08 18:00:00' and server_time < '2021-03-08 20:00:00' group by profile_id, quality;
select profile_id, count(*) as n from qualities group by profile_id order by n desc limit 10;


CREATE TABLE public.users (
    action_id character varying(50),
    action_attributes_str character varying(50),
    action_attributes_num integer,
    action_attributes_tag integer,
    action_result character varying(50),
    action_attributes_ab_tag character varying(100),
    profile_id character varying(100),
    content_id character varying(100),
    content_type character varying(100),
    device_type character varying(100),
    device_name character varying(100),
    device_model character varying(100),
    device_vendor character varying(100),
    platform_id character varying(100),
    user_agent character varying(1000),
    user_browser character varying(100),
    user_browser_version character varying(100),
    user_os character varying(100),
    user_os_version character varying(100),
    session_id character varying(100),
    request_ip character varying(100),
    server_time timestamp without time zone,
    event_time timestamp without time zone
);
