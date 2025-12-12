const roleService = require("../services/role.service");
const JSend = require("../utils/jsend");
const ApiError = require("../utils/api-error");

async function getAllRoles(req, res, next) {
  try {
    const roles = await roleService.getAllRoles();
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(JSend.success(roles));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function getRoleById(req, res, next) {
  try {
    const roleId = req.params.id;
    const role = await roleService.getRoleById(roleId);
    if (!role) {
      return next(new ApiError(404, "Role not found"));
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(JSend.success(role));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function createRole(req, res, next) {
  try {
    const roleData = req.body;
    const newRole = await roleService.createRole(roleData);
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json(JSend.success(newRole));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function updateRole(req, res, next) {
  try {
    const roleId = req.params.id;
    const roleData = req.body;
    const updatedRole = await roleService.updateRole(roleId, roleData);
    if (!updatedRole) {
      return next(new ApiError(404, "Role not found"));
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(JSend.success(updatedRole));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function deleteRole(req, res, next) {
  try {
    const roleId = req.params.id;
    const deleted = await roleService.deleteRole(roleId);
    if (!deleted) {
      return next(new ApiError(404, "Role not found"));
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(204).json(JSend.success(null));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
