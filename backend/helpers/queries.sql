select id, action_attributes_str, action_attributes_num, action_result, request_ip, server_time into buffering_stop from users where action_id='buffer_stop';

select a.action_attributes_str as buff_time, b.longitude, b.latitude into buff_stop_metric_14 from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= '2021-03-14 18:00:00' and server_time < '2021-03-14 20:00:00';
select a.action_attributes_str as buff_time, b.longitude, b.latitude from buffering_stop a, unique_ips b where a.action_attributes_str < 300000 and a.request_ip = b.ip and server_time >= '2021-03-14 18:00:00' and server_time < '2021-03-14 20:00:00';
